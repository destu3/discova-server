import catchAsyncError from '../utils/catch-async.js';
import OperationalError from '../classes/operational-error.js';
import { parseAnimeTheme } from '../utils/anime-utils.js';
import fields from '../graphql/fields.js';
import fieldsExd from '../graphql/extended-fields.js';
import { getYear, getNextSeason, getSeason } from '../utils/anime-utils.js';
import { makeFetchRequest, getMediaArray } from '../utils/network-utils.js';

// search for anime using the aniList api
export const search = catchAsyncError(async (req, res, next) => {
  let { search, page, per_page, genres, seasonYear, season, sort } = req.query;

  sort = sort === 'AVERAGE SCORE_DESC' ? 'SCORE_DESC' : sort;

  const query = `
    query ($search: String, $genres: [String], $seasonYear: Int, $season: MediaSeason, $sort: [MediaSort], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(isAdult: false, search: $search, genre_in: $genres, season: $season, seasonYear: $seasonYear, type: ANIME, sort: $sort) {
          ${fields}
        }
      }
    }
  `;

  const variables = {
    search: search ? search : null,
    genres: genres ? genres.split(',') : null,
    seasonYear: seasonYear ? seasonYear : null,
    season: season ? season : undefined,
    sort: sort ? sort : 'TRENDING_DESC',
    page: page || 1,
    perPage: per_page || 20,
  };

  try {
    const response = await makeFetchRequest(true, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const pageInfo = response.data.Page.pageInfo;
    const mediaArray = response.data.Page.media;

    // if no results are returned send error with 404 status code
    if (mediaArray.length === 0) {
      throw new OperationalError(
        'No results found. Please try a different search term.',
        404
      );
    }

    // send results back to the client
    res.status(200).json({ pageInfo, mediaArray });
  } catch (error) {
    next(error);
  }
});

// get the metadata for an anime
export const getAnimeInfo = catchAsyncError(async (req, res, next) => {
  const aniListId = req.params.aniListId;
  const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME, isAdult: false) {
      ${fieldsExd}
    }
  }
  `;

  const variables = {
    id: aniListId,
  };

  try {
    const response = await makeFetchRequest(true, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const animeInfo = response.data.Media;

    // send results back to the client
    res.status(200).json({ animeInfo });
  } catch (error) {
    next(error);
  }
});

// retrieve the themes for an anime
export const getThemes = catchAsyncError(async (req, res, next) => {
  const id = req.params.aniListId;

  try {
    const response = await makeFetchRequest(false, {}, id);

    const { anime } = response;

    const themes = anime[0]?.animethemes.map(parseAnimeTheme);

    let ops = [];
    let eds = [];
    themes?.forEach(theme =>
      theme.type === 'OP' ? ops.push(theme) : eds.push(theme)
    );

    if (!themes) {
      return res.status(200).json({ status: 'success', themes: undefined });
    }

    res.status(200).json({ status: 'success', themes: { ops, eds } });
  } catch (error) {
    next(error);
  }
});

// retrieve data for anime in a list
export const getAnimeDetailsByIds = catchAsyncError(async (req, res, next) => {
  const { watchList } = req.user;
  const query = `
  query {
    Page {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id_in: ${JSON.stringify(watchList)}, type: ANIME, isAdult: false) {
        ${fields}
      }
    }
  }
  `;

  try {
    const response = await makeFetchRequest(true, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    const { media } = response.data.Page;

    // send results back to the client
    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
});

// fetch popular anime for current season
export const getPopularThisSeason = catchAsyncError(async (req, res) => {
  const season = getSeason();
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
        }
        media(type: ANIME, season: ${season}, seasonYear: ${getYear()}, sort: POPULARITY_DESC, isAdult: false) {
          ${fields}
        }
      }
    }
  `;

  // Call getMediaArray with query and return media array
  const { mediaArray } = await getMediaArray(query);
  res.status(200).json(mediaArray);
});

// fetch trending anime
export const getTrending = catchAsyncError(async (req, res) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
        }
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          ${fields}
        }
      }
    }
  `;

  // Call getMediaArray with query and return media array
  const { mediaArray } = await getMediaArray(query);
  res.status(200).json(mediaArray);
});

// fetch upcoming anime for next season
export const getUpcoming = catchAsyncError(async (req, res) => {
  const nextSeason = getNextSeason();
  let year = getYear();
  year = nextSeason === 'WINTER' ? year + 1 : year;

  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
        }
        media(type: ANIME, status: NOT_YET_RELEASED, season: ${nextSeason}, seasonYear: ${year}, sort: POPULARITY_DESC, isAdult: false) {
          ${fields}
        }
      }
    }
  `;

  // Call getMediaArray with query and return media array
  const { mediaArray } = await getMediaArray(query);
  res.status(200).json(mediaArray);
});

// fetch popular anime
export const getPopular = catchAsyncError(async (req, res) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
        }
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          ${fields}
        }
      }
    }
  `;

  const { mediaArray } = await getMediaArray(query);
  res.status(200).json(mediaArray);
});
