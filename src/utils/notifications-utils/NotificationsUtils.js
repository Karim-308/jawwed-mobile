import * as Notifications from 'expo-notifications';

// Requesting notifications permission
export const requestNotificationsPermission = async () => {

    const notificationPermissionResponse = {
        status: null,
        errorStatus: null
    }

    try {
        const { status } = await Notifications.getPermissionsAsync();

        if (status !== 'granted') {

            const requestResult = await Notifications.requestPermissionsAsync();
            notificationPermissionResponse.status = requestResult.status;

            if (requestResult.status !== 'granted') {
                // Error: User has denied the notifications permission
                notificationPermissionResponse.errorStatus = 'يجب منح إذن الإشعارات للتطبيق حتى تستطيع استلام الإشعارات';
            }
            
            return notificationPermissionResponse;
        }

        notificationPermissionResponse.status = status;
        return notificationPermissionResponse;

    } catch (error) {
        notificationPermissionResponse.status = 'error';
        notificationPermissionResponse.errorStatus = 'حدث خطأ ما أثناء محاول الحصول على إذن الإشعارات';
        return notificationPermissionResponse;
    }

}

// trigger the notification
export const triggerNotification = async (notificationTitle, notificationBody, triggerAfterTimeInMinutes) => {
    
    try {

        await Notifications.scheduleNotificationAsync({
            content: {
                title: notificationTitle,
                body: notificationBody,
                sound: true
            },
            trigger: triggerAfterTimeInMinutes? {seconds: triggerAfterTimeInMinutes * 60} : null
        });

    } catch (error) {
        console.log(error);
    }
};