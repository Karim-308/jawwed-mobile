import '@react-native-firebase/app';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

export async function getFcmTokenAndSendToJawwed() {
  const app = getApp();
  const messaging = getMessaging(app);

  // Request permission (first time only)
  const authStatus = await requestPermission();
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;
  if (!enabled) {
    console.warn('Push permission not granted');
    return;
  }

  // Get the FCM token
  const fcmToken = await getToken(messaging);
  console.log('FCM Token:', fcmToken);
  return fcmToken;
}


// Send it to your backend API
/*try {
    await fetch('https://jawwed-api.runasp.net/api/Notification/register-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fcmToken }),
    });
} catch (error) {
    console.error('Failed to register FCM token:', error);
}*/