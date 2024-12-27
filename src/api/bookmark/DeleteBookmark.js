import axios from 'axios';

const deleteBookmark = async (userId, verseKey) => {
  const url = 'http://jawwed-api.runasp.net/api/Bookmark';

  try {
    const response = await axios.delete(url, {
      params: { userId, verseKey },
      timeout: 10000 // Timeout set to 10 seconds
    });

    // Handle success
    console.log(`Bookmark deleted successfully for userId: ${userId} and verseKey: ${verseKey}`);
    return response.data;
  } catch (error) {
    // Handle errors
    if (error.response) {
      // Server responded with a status code out of the range of 2xx
      console.error('Error response:', error.response);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error message:', error.message);
    }
    throw error; // Re-throw the error for further handling
  }
};

export default deleteBookmark;
