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
        //console.log(`${key} - ${prayerTimes[key]}`);
        const prayerHoursDiff = getHoursDiff(zonedDateTimeNow, prayerTimes[key]);
        const prayerMinutesDiff = getMinutesDiff(zonedDateTimeNow, prayerTimes[key]);
        //console.log(`key: ${key}, hours left: ${prayerHoursDiff}, minutes left: ${prayerMinutesDiff}`);
        if ((prayerHoursDiff < nextPrayer.hoursLeft) || 
            ((prayerHoursDiff === nextPrayer.hoursLeft) && (prayerMinutesDiff < nextPrayer.minutesLeft)) ||
            (nextPrayer.hoursLeft === null))
        {
            nextPrayer.name = prayerNames[key];
            nextPrayer.hoursLeft = prayerHoursDiff;
            nextPrayer.minutesLeft = prayerMinutesDiff;
            //console.log(`in for ${key}`);
        }
    });

    return nextPrayer;
};