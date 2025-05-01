import axios from 'axios';
import {get} from '../../utils/localStorage/secureStore'; // Adjust the import path as necessary
import jawwedHttpClient from '../../utils/httpclient'; // Adjust the import path as necessary 


const getBookmarks = async () => {
  const url = 'Bookmark';
  const token = await get('userToken'); // Assuming you have a function to get the token

  try {
    const response = await jawwedHttpClient.get(url);

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
