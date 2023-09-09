export const parseAnimeTheme = theme => {
  return {
    type: theme.type,
    sequence: theme.sequence,
    slug: theme.slug,
    songId: theme.song?.id,
    songTitle: theme.song?.title,
    artists: theme.song?.artists,
    video: {
      episodes: theme.animethemeentries[0]?.episodes,
      spoiler: theme.animethemeentries[0]?.spoiler,
      link: theme.animethemeentries[0].videos[0]?.link,
      mimetype: theme.animethemeentries[0].videos[0]?.mimetype,
    },
  };
};

// Retrieves the current year.
export function getYear() {
  const currentSeason = getSeason();

  const year = new Date().getFullYear();

  // Get the current year
  return currentSeason === 'WINTER' ? year + 1 : year;
}

// Retrieves the current season.
export function getSeason() {
  // Get the current month and determine the season
  const date = new Date();
  const month = date.getMonth() + 1;
  let season = 'winter';

  if (month >= 10 && month <= 12) {
    season = 'fall';
  } else if (month >= 4 && month <= 6) {
    season = 'spring';
  } else if (month >= 7 && month <= 9) {
    season = 'summer';
  }

  // Convert the season to uppercase and return it
  return season.toUpperCase();
}

// Retrieves the next season based on the current season.
export function getNextSeason() {
  const season = getSeason();

  // Get the next season based on the current season
  if (season === 'WINTER') {
    return 'SPRING';
  } else if (season === 'SPRING') {
    return 'SUMMER';
  } else if (season === 'SUMMER') {
    return 'FALL';
  } else {
    return 'WINTER';
  }
}
