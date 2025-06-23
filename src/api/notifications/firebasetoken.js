import { getMessaging, requestPermission, getToken, isDeviceRegisteredForRemoteMessages } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import createReadingGoal from '../../api/goals/sendGoal'; // Adjust the import path as necessary

const requestUserPermission = async () => {
  const messaging = getMessaging();

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
    await requestPermission(messaging); // NEW modular API
    const token = await getToken(messaging);

    await registerTokenAtJawwed(token); //Let's call JawwedDB API
    console.log('Token registered successfully');
    // await createReadingGoal(); // Call the sendGoal function

    console.log('FCM Token:', token);
  } catch (err) {
    console.error('Permission rejected', err);
  }
};

const registerTokenAtJawwed = async (token) => {
  try {
    const response = await axios.post(
      'https://jawwed-api.runasp.net/api/Notification/register-device',
      { deviceToken: token },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    if (response.status === 200) {
      console.log('Token registration successful');
    } else {
      console.warn('Token registration failed');
    }
    return response.data;
  } catch (error) {
    console.error('Token registration failed:', error.response?.data || error.message);
    throw error; // Re-throw to let caller handle if needed
  }
};



export default requestUserPermission;