import axios from 'axios';

const getBookmarks = async () => {
  const url = 'http://jawwed-api.runasp.net/api/Bookmark';
  const defaultUserId = 2;

  try {
    const response = await axios.get(url, {
      params: { userId: defaultUserId },
      timeout: 10000 // Timeout set to 10 seconds
    });

    // Handle success
    console.log('Bookmarks retrieved successfully:', response.data);
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

export default getBookmarks;
