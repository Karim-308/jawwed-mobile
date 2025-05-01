import { ToastAndroid, Alert, Platform } from 'react-native';
import jawwedHttpClient from '../../utils/httpclient'; // ✅ Using the configured Axios instance

const deleteBookmark = async (userId, verseKey) => {
  const url = 'Bookmark'; // ✅ Base URL is already handled in jawwedHttpClient

  try {
    const response = await jawwedHttpClient.delete(url, {
      params: { userId, verseKey },
      timeout: 10000,
    });

    // ✅ Success message
    console.log('Bookmark successfully deleted:', response.data);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Bookmark Deleted', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Bookmark Deleted');
    }

    return response.data;
  } catch (error) {
    // ✅ Error handling
    if (error.response) {
      console.error('Error response:', error.response);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    if (Platform.OS === 'android') {
      ToastAndroid.show('Failed to delete bookmark', ToastAndroid.SHORT);
    } else {
      Alert.alert('Error', 'Failed to delete bookmark');
    }

    throw error;
  }
};

export default deleteBookmark;
