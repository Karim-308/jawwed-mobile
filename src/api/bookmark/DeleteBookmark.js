import { ToastAndroid, Alert, Platform } from 'react-native';
import jawwedHttpClient from '../../utils/httpclient';

const deleteBookmark = async ({ identifier, type }) => {
  const url = 'Bookmark';

  try {
    const response = await jawwedHttpClient.delete(url, {
      params: {
        identifier: identifier.toString(),
        type: type,
      },
      timeout: 10000,
    });

    console.log('Bookmark successfully deleted:', response.data);
    if (Platform.OS === 'android') {
      ToastAndroid.show('تم حذف الإشارة المرجعية بنجاح', ToastAndroid.SHORT);
    } else {
      Alert.alert('تم الحذف', 'تم حذف الإشارة المرجعية بنجاح');
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
      ToastAndroid.show('فشل في حذف الإشارة المرجعية', ToastAndroid.SHORT);
    } else {
      Alert.alert('خطأ', 'فشل في حذف الإشارة المرجعية');
    }

    throw error;
  }
};

export default deleteBookmark;
