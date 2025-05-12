import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { getNextPrayer } from './PrayerTimesClockFunctions';
import { prayerNames } from '../PrayerTimesData';
import { formatTime, getHoursDiff, getMinutesDiff } from '../../../../utils/time-utils/TimeUtils';


export default function PrayerTimesClock() {

    const prayerTimes = useSelector((state) => state.prayerTimes.prayerTimes);
    const timeZone = useSelector((state) => state.prayerTimes.timeZone);
    const locationDeterminationMethod = useSelector((state) => state.prayerTimes.locationDeterminationMethod);
    const country = useSelector((state) => state.prayerTimes.country);
    const city = useSelector((state) => state.prayerTimes.city);
    const [currentTime, setCurrentTime] = useState('');
    
    // time left till next prayer = hoursLeft + minutesLeft
    const [nextPrayerName, setNextPrayerName] = useState('');
    const [hoursLeft, setHoursLeft] = useState('');
    const [minutesLeft, setMinutesLeft] = useState('');

    useEffect(() => {

        const setPrayerTimesClock = async () => {
            const timeNow = new Date();
            setCurrentTime(formatTime(timeNow, timeZone));
            const nextPrayer = await getNextPrayer(prayerNames, prayerTimes, timeNow);
            setNextPrayerName(nextPrayer.name);
            setHoursLeft(getHoursDiff(timeNow, nextPrayer.time));
            setMinutesLeft(getMinutesDiff(timeNow, nextPrayer.time));
        };

        if (prayerTimes && timeZone) {
            setPrayerTimesClock();
            const interval = setInterval(setPrayerTimesClock, 1000);
            return () => clearInterval(interval);
        }

    }, [prayerTimes]);


    return (
        (prayerTimes)?
        <View style={styles.container}>
            <Text style={styles.time}>{currentTime}</Text>
            {
                (hoursLeft !== 0)?
                    <Text style={styles.nextPrayer}>متبقي {Intl.NumberFormat('ar-EG').format(hoursLeft)} ساعة و {Intl.NumberFormat('ar-EG').format(minutesLeft)} دقيقة</Text>
                    :
                    <Text style={styles.nextPrayer}>متبقي {Intl.NumberFormat('ar-EG').format(minutesLeft)} دقيقة</Text>
            }
            <Text style={styles.nextPrayer}> على رفع أذان صلاة {nextPrayerName}</Text>
            <View>
                {
                    (locationDeterminationMethod === 'Manual')?
                        <Text style={styles.locationText}>{country} - {city}</Text>
                        :
                        <Text style={styles.locationText}>تم تحديد الموقع تلقائياً</Text>
                }
            </View>
        </View>
        :
        <></>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    time: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15
    },
    nextPrayer: {
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center',
        marginVertical: 2
    },
    locationText: {
        fontSize: 12,
        color: '#CCC',
        textAlign: 'center',
        marginTop: 15
    }
});