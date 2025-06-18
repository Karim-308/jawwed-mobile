import { ToastAndroid, Alert, Platform } from 'react-native';
import jawwedHttpClient from '../../utils/httpclient';

const postBookmark = async (bookmarkData) => {
  const url = 'Bookmark';

  // Construct request body dynamically based on bookmarkType
  const body = {
    bookmarkType: bookmarkData.bookmarkType,
  };

  if (bookmarkData.bookmarkType === 0) {
    // Bookmarking a verse
    body.verseKey = bookmarkData.verseKey;
    body.verse = bookmarkData.verse;
    body.page = bookmarkData.page;
  } else if (bookmarkData.bookmarkType === 1) {
    // Bookmarking a zekr
    body.zekrID = bookmarkData.zekrID;
  }

  try {
    const response = await jawwedHttpClient.post(url, body);

    console.log('Bookmark successfully posted:', response.data);
    if (Platform.OS === 'android') {
      ToastAndroid.show('تم حفظ الإشارة المرجعية بنجاح', ToastAndroid.SHORT);
    } else {
      Alert.alert('تم الحفظ', 'تم حفظ الإشارة المرجعية بنجاح');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    if (Platform.OS === 'android') {
      ToastAndroid.show('فشل في حفظ الإشارة المرجعية', ToastAndroid.SHORT);
    } else {
      Alert.alert('خطأ', 'فشل في حفظ الإشارة المرجعية');
    }

    throw error;
  }
};

export default postBookmark;
