import { ToastAndroid, Alert, Platform } from 'react-native';
import jawwedHttpClient from '../../utils/httpclient'; // ✅ Default import

const postBookmark = async (bookmarkData) => {
  const url = 'Bookmark'; // ✅ Relative to baseURL already set in jawwedHttpClient

  try {
    const response = await jawwedHttpClient.post(url, {
      verseKey: bookmarkData.verseKey,
      verse: bookmarkData.verse,
      page: bookmarkData.page,
    });

    // ✅ Success message
    console.log('Bookmark successfully posted:', response.data);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Bookmark Saved', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Bookmark Saved');
    }

    return response.data;
  } catch (error) {
    // ✅ Error logging
    if (error.response) {
      console.error('Error response:', error.response);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    // ✅ User feedback on failure
    if (Platform.OS === 'android') {
      ToastAndroid.show('Failed to save bookmark', ToastAndroid.SHORT);
    } else {
      Alert.alert('Error', 'Failed to save bookmark');
    }

    throw error;
  }
};

export default postBookmark;
