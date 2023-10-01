// Parses the response and returns data if response is ok. Throws an error with a generic error message or a specific message from the server if response is not ok.
export const handleResponse = async response => {
  const result = await response.json();

  if (response.ok) return result;

  let errorMessage;

  if (result) {
    errorMessage =
      result.message || result.errors[0].message || 'An error has occurred';
  }

  throw new Error(errorMessage);
};

// Helper function for making fetch requests
export const makeFetchRequest = async (aniList, options, id) => {
  const url = aniList
    ? 'https://graphql.anilist.co'
    : `https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=${id}&include=animethemes.song.artists,animethemes.animethemeentries.videos`;
  const response = await fetch(url, options);

  return await handleResponse(response);
};

// Helper function to fetch media array with given GraphQL query
export const getMediaArray = async query => {
  const url = 'https://graphql.anilist.co';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        page: 1,
        perPage: 20,
      },
    }),
  });

  const data = await handleResponse(response);
  const pageInfo = data.data.Page.pageInfo;
  const mediaArray = data.data.Page.media;
  // Throw error if request was successful but an empty media array is returned
  if (mediaArray.length === 0) {
    throw new Error('No results found. Please try again later');
  }

  return { mediaArray, pageInfo };
};
