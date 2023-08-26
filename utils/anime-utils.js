export const parseAnimeTheme = theme => {
  return {
    type: theme.type,
    sequence: theme.sequence,
    slug: theme.slug,
    songId: theme.song.id,
    songTitle: theme.song.title,
    artists: theme.song.artists,
    video: {
      episodes: theme.animethemeentries[0].episodes,
      spoiler: theme.animethemeentries[0].spoiler,
      link: theme.animethemeentries[0].videos[0].link,
      mimetype: theme.animethemeentries[0].videos[0].mimetype,
    },
  };
};
