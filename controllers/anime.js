import superagent from 'superagent';
import catchAsyncErr from '../utils/catch-async.js';
import OperationalError from '../classes/operational-error.js';
import { parseAnimeTheme } from '../utils/anime-utils.js';
import fields from '../graphql/fields.js';
import fieldsExd from '../graphql/extended-fields.js';

// search for anime using the aniList api
export const search = catchAsyncErr(async (req, res, next) => {
  const { search, page, per_page, genres, seasonYear, season, sort } =
    req.query;

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

  // request for data based on search term
  const response = await superagent
    .post('https://graphql.anilist.co')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      query: query,
      variables: variables,
    });

  const pageInfo = response.body.data.Page.pageInfo;
  const mediaArray = response.body.data.Page.media;

  // if no results are returned send error with 404 status code
  if (mediaArray.length === 0) {
    throw new OperationalError(
      'No results found. Please try a different search term.',
      404
    );
  }

  // send results back to the the client
  res.status(200).json({ pageInfo, mediaArray });
});

export const getAnimeInfo = catchAsyncErr(async (req, res, next) => {
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

  // request for data based on search term
  const response = await superagent
    .post('https://graphql.anilist.co')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      query: query,
      variables: variables,
    });

  const animeInfo = response.body.data.Media;

  // send results back to the the client
  res.status(200).json({ animeInfo });
});

export const getThemes = catchAsyncErr(async (req, res) => {
  const id = req.params.aniListId;
  const BASE_URL = `https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=${id}
                    &include=animethemes.song.artists,animethemes.animethemeentries.videos`;

  const response = await superagent.get(BASE_URL);
  const { anime } = response.body;

  const themes = anime[0]?.animethemes.map(parseAnimeTheme);

  res.status(200).json({ status: 'success', themes });
});
