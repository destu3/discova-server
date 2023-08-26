const fields = `
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
  season
  seasonYear
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
export default fields;
