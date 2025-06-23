import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// formats time to hh:mm
export const formatTime = (dateTime) => {
    return format(dateTime, 'hh:mm a', {locale: ar});
}

// formats date to EEEE dd MMMM yyyy
export const formatDate = (dateTime) => {
    return format(dateTime, 'EEEE dd MMMM yyyy', {locale: ar});
}

// convert date from local to the provieded time zone
export const convertTimeZone = (date, timeZoneGMTOffsetInSeconds) => {
    const localOffsetInSeconds = date.getTimezoneOffset() * 60;
    return new Date(date.getTime() + (timeZoneGMTOffsetInSeconds + localOffsetInSeconds) * 1000);
}

// get the difference between two times (in hours and discards the minutes)
export const getHoursDiff = (currentTime, futureTime) => {
    if (futureTime >= currentTime)
        return Math.floor((futureTime - currentTime) / 1000 / 60 / 60);
    else
        return Math.floor((futureTime - currentTime + 24*60*60*1000) / 1000 / 60 / 60);
}

// get the difference between two times (in minutes and discards the complete hours)
export const getMinutesDiff = (currentTime, futureTime) => {
    if (futureTime >= currentTime)
        return Math.floor(((futureTime - currentTime) / 1000 / 60) % 60);
    else
        return Math.floor(((futureTime - currentTime + 24*60*60*1000) / 1000 / 60) % 60);
}

export const compareDateWithToday = (date) => {
    dateToBeCompared = new Date (date);
    todayDate = new Date();

    // clear the time part (to compare dates)
    dateToBeCompared.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    if(dateToBeCompared.getTime() === todayDate.getTime())
        return 'equal';
    else if(dateToBeCompared.getTime() > todayDate.getTime())
        return 'future';
    else
        return 'past';
}