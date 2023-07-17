export const fields = `
id
title {
  romaji
  english
  native
}
description
coverImage {
  extraLarge
  color
}
trailer {
  id
  site
  thumbnail
}
status
bannerImage
genres
meanScore
nextAiringEpisode {
  airingAt
  timeUntilAiring
  episode
}
episodes
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
format
`;

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
trending
trailer {
  id
  site
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
