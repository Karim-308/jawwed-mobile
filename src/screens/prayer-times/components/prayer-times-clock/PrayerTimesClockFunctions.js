// get the next prayer name and time based on the current time
export const getNextPrayer = async (prayerNames, prayerTimes, timeNow) => {

    let nextPrayer = {
        name: null,
        time: null
    };

    const prayerKeys = Object.keys(prayerNames);
    const nextPrayerKey = prayerKeys.find((key) => prayerTimes[key] && timeNow < prayerTimes[key]);

    if (nextPrayerKey){
        nextPrayer.name = prayerNames[nextPrayerKey];
        nextPrayer.time = prayerTimes[nextPrayerKey].getTime();
    }          
    // After Ishaa and Before 12:00 AM
    else {
        nextPrayer.name = prayerNames['fajr'];
        nextPrayer.time = prayerTimes['fajr'].getTime() + (24 * 60 * 60 * 1000);
    }

    return nextPrayer;
};