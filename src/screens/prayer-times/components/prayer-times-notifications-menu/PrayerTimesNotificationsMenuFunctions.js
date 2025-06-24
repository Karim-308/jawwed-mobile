import { triggerNotification } from '../../../../utils/notifications-utils/NotificationsUtils';
import { VolumeManager } from 'react-native-volume-manager';


export const triggerPrayerTimesNotification = (prayerName) => {

    if (prayerName === 'الفجر') {
        triggerNotification(
            'حان الان موعد أذان الفجر',
            'أمامك 25 دقيقة قبل إقامة الصلاة',
            0
        );
    }
    else if (prayerName === 'الظهر') {
        triggerNotification(
            'حان الان موعد أذان الظهر',
            'أمامك 15 دقيقة قبل إقامة الصلاة',
            0
        );
    }
    else if (prayerName === 'العصر') {
        triggerNotification(
            'حان الان موعد أذان العصر',
            'أمامك 20 دقيقة قبل إقامة الصلاة',
            0
        );
    }
    else if (prayerName === 'المغرب') {
        triggerNotification(
            'حان الان موعد أذان المغرب',
            'أمامك 10 دقائق قبل إقامة الصلاة',
            0
        );
    }
    else { //(prayerName === 'isha') 
        triggerNotification(
            'حان الان موعد أذان العشاء',
            'أمامك 15 دقيقة قبل إقامة الصلاة',
            0
        );
    }

};


export const muteVolume = async () => {
    try {
        const {volume} = await VolumeManager.getVolume();
        let volumeLevel = volume;
        await VolumeManager.setVolume(0);
        return volumeLevel;
    }
    catch (error) {
        console.log(error);
    }
};

export const unmuteVolume = async (volumeLevel) => {
    try {
        await VolumeManager.setVolume(volumeLevel || 0.5);
    }
    catch (error) {
        console.log(error);
    }
}
