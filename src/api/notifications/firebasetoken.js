import { PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import axios from 'axios';
import createReadingGoal from '../../api/goals/sendGoal'; // Adjust if needed

const requestUserPermission = async () => {
  const app = getApp();
  const messaging = getMessaging(app);

  // ✅ Android 13+ requires explicit POST_NOTIFICATIONS permission
  if (Platform.OS === 'android' && Platform.Version > 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('Notification permission not granted');
      return;
    }
  }

  try {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('Push permission not granted');
      return;
    }

    const token = await getToken(messaging);
    console.log('FCM Token:', token);

    await registerTokenAtJawwed(token); // Call backend API
    console.log('Token registered successfully');

    // Optionally: await createReadingGoal();
  } catch (err) {
    console.error('Permission rejected or error occurred:', err);
  }
};

const registerTokenAtJawwed = async (token) => {
  try {
    const response = await axios.post(
      'https://jawwed-api.runasp.net/api/Notification/register-device',
      { deviceToken: token },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200) {
      console.log('Token registration successful');
    } else {
      console.warn('Token registration failed with status:', response.status);
    }
    return response.data;
  } catch (error) {
    console.error(
      'Token registration failed:',
      error.response?.data || error.message
    );
    throw error; // rethrow for caller to handle
  }
};

export default requestUserPermission;
