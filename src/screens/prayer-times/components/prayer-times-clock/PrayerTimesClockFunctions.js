import { prayerNames } from '../PrayerTimesData';
import { getHoursDiff, getMinutesDiff } from '../../../../utils/date-time-utils/DateTimeUtils';

// get the next prayer information based on the current time
export const getNextPrayer = async (prayerTimes, zonedDateTimeNow) => {

    const nextPrayer = {
        name: null,
        hoursLeft: null,
        minutesLeft: null
    };

    const prayerKeys = Object.keys(prayerNames);

    prayerKeys.forEach((key) => {
        const prayerHoursDiff = getHoursDiff(zonedDateTimeNow, prayerTimes[key]);
        const prayerMinutesDiff = getMinutesDiff(zonedDateTimeNow, prayerTimes[key]);
        if ((prayerHoursDiff < nextPrayer.hoursLeft) || 
            ((prayerHoursDiff === nextPrayer.hoursLeft) && (prayerMinutesDiff < nextPrayer.minutesLeft)) ||
            (nextPrayer.hoursLeft === null))
        {
            nextPrayer.name = prayerNames[key];
            nextPrayer.hoursLeft = prayerHoursDiff;
            nextPrayer.minutesLeft = prayerMinutesDiff;
        }
    });

    return nextPrayer;
};