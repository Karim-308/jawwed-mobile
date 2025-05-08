import messaging from '@react-native-firebase/messaging';

export async function getFcmTokenAndSendToJawwed() {
  // Request permission (first time only)
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.warn('Push permission not granted');
    return;
  }

  // Get the FCM token
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);

// Send it to your backend API
try {
    await fetch('https://jawwed-api.runasp.net/api/Notification/register-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fcmToken }),
    });
} catch (error) {
    console.error('Failed to register FCM token:', error);
}
}
