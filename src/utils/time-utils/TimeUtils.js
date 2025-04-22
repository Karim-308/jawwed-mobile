// formats time to hh:mm in arabic according to the timezone
export const formatTime = (time, timeZone) => {
    return time.toLocaleTimeString('ar-EG', { timeZone: `${timeZone}`, hour: '2-digit', minute: '2-digit' });
}

// get the difference between two times (in hours and discards the minutes)
export const getHoursDiff = (currentTime, futureTime) => {
    return Math.floor((futureTime - currentTime) / 1000 / 60 / 60);
}

// get the difference between two times (in minutes and discards the complete hours)
export const getMinutesDiff = (currentTime, futureTime) => {
    return Math.floor(((futureTime - currentTime) / 1000 / 60) % 60);;
}