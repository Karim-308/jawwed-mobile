import axios from 'axios';
import { ToastAndroid, Alert, Platform } from 'react-native';
const deleteBookmark = async (userId, verseKey) => {
  const url = 'http://jawwed-api.runasp.net/api/Bookmark';

  try {
    const response = await axios.delete(url, {
      params: { userId, verseKey },
      timeout: 10000 // Timeout set to 10 seconds
    });

    // Handle success
    console.log('Bookmark successfully posted:', response.data);
    // Display success message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Bookmark Deleted', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Bookmark Deleted');
    }
    

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

    // Show error feedback to the user
         // I did "Bookmark already saved" but it can be anything this is just for demo
         if (Platform.OS === 'android') {
          ToastAndroid.show('Failed to delete bookmark', ToastAndroid.SHORT);
        } else {
          Alert.alert('Error', 'Failed to delete bookmark');
        }

    throw error; // Re-throw the error for further handling
  }
};

export default deleteBookmark;
