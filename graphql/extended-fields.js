export const fieldsExd = `
  id
  idMal
  title {
    romaji
    english
    native
  }
  type
  genres
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  source
  season
  seasonYear
  format
  status
  episodes
  streamingEpisodes {
    title
    thumbnail
    url
  }
  trending
  trailer {
    id
    site
  }
  characters(sort: FAVOURITES_DESC) {
    edges {
      node {
        id
        name {
          full
        }
        image {
          large
        }
        description
        siteUrl
      }
      role
      voiceActors {
        id
        name {
          full
        }
        language
      }
    }
  }
  relations {
    edges {
      node {
        id
        title {
          romaji
          english
          native
        }
        type
        genres
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        source
        season
        seasonYear
        format
        status
        episodes
        trending
        trailer {
          id
          site
        }
        bannerImage
        coverImage {
          extraLarge
          medium
          large
          color
        }
        description
        averageScore
        popularity
        duration
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        type
      }
      relationType
    }
  }
  recommendations(sort: RATING_DESC) {
    nodes {
      mediaRecommendation {
        id
        title {
          romaji
          english
          native
        }
        type
        genres
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        source
        season
        seasonYear
        format
        status
        episodes
        trending
        trailer {
          id
          site
        }
        bannerImage
        coverImage {
          extraLarge
          medium
          large
          color
        }
        description
        averageScore
        popularity
        duration
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        type
      }
      rating
      userRating
    }
  }
  bannerImage
  coverImage {
    extraLarge
    large
    color
  }
  description
  averageScore
  popularity
  duration
  nextAiringEpisode {
    airingAt
    timeUntilAiring
    episode
  }
`;

export default fieldsExd;
