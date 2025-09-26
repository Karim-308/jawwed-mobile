import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { getNextPrayer } from './PrayerTimesClockFunctions';
import {
  triggerPrayerTimesNotification,
  muteVolume,
  unmuteVolume,
} from '../prayer-times-notifications-menu/PrayerTimesNotificationsMenuFunctions';
import {
  formatTime,
  formatDate,
  convertTimeZone,
} from '../../../../utils/date-time-utils/DateTimeUtils';
import { toArabicNumerals } from '../../../../utils/helpers';

export default function PrayerTimesClock() {
  const prayerTimes = useSelector((state) => state.prayerTimes.prayerTimes);
  const timeZone = useSelector((state) => state.prayerTimes.timeZone);
  const locationDeterminationMethod = useSelector(
    (state) => state.prayerTimes.locationDeterminationMethod
  );
  const country = useSelector((state) => state.prayerTimes.country);
  const city = useSelector((state) => state.prayerTimes.city);

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // time left till next prayer = hoursLeft + minutesLeft
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [hoursLeft, setHoursLeft] = useState('');
  const [minutesLeft, setMinutesLeft] = useState('');

  // for prayer times notifications
  const [currentPrayerName, setCurrentPrayerName] = useState('');
  const isPrayerTimesNotificationsActive = useSelector(
    (state) => state.prayerTimes.isPrayerTimesNotificationsActive
  );
  const [volumeLevel, setVolumeLevel] = useState('');
  const isMuteDuringPrayerTimesActive = useSelector(
    (state) => state.prayerTimes.isMuteDuringPrayerTimesActive
  );

  useEffect(() => {
    const setPrayerTimesClock = async () => {
      const zonedDateTimeNow = convertTimeZone(new Date(), timeZone.gmtOffset);
      setCurrentTime(formatTime(zonedDateTimeNow));
      setCurrentDate(formatDate(zonedDateTimeNow));

      const nextPrayer = await getNextPrayer(prayerTimes, zonedDateTimeNow);
      setNextPrayerName(nextPrayer.name);
      setHoursLeft(nextPrayer.hoursLeft);
      setMinutesLeft(nextPrayer.minutesLeft);

      // trigger prayer notification once when its time comes
      if (
        isPrayerTimesNotificationsActive &&
        nextPrayer.hoursLeft === 0 &&
        nextPrayer.minutesLeft === 0 &&
        currentPrayerName !== nextPrayer.name
      ) {
        setCurrentPrayerName(nextPrayer.name);
        triggerPrayerTimesNotification(nextPrayer.name);
        if (isMuteDuringPrayerTimesActive) {
          setVolumeLevel(muteVolume());
          setTimeout(() => {
            // unmute after 30 mins
            unmuteVolume(volumeLevel);
          }, 30 * 60 * 1000);
        }
      }
    };

    if (prayerTimes && timeZone) {
      setPrayerTimesClock();
      const interval = setInterval(setPrayerTimesClock, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [prayerTimes]);

  return prayerTimes ? (
    <View style={styles.container}>
      <Text style={styles.time}>{toArabicNumerals(currentTime)}</Text>
      <Text style={styles.date}>{toArabicNumerals(currentDate)}</Text>
      {hoursLeft !== 0 ? (
        <Text style={styles.nextPrayer}>
          متبقي {toArabicNumerals(hoursLeft)} ساعة و{' '}
          {toArabicNumerals(minutesLeft)} دقيقة
        </Text>
      ) : (
        <Text style={styles.nextPrayer}>
          متبقي {toArabicNumerals(minutesLeft)} دقيقة
        </Text>
      )}
      <Text style={styles.nextPrayer}> على رفع أذان صلاة {nextPrayerName}</Text>
      <View>
        {locationDeterminationMethod === 'Manual' ? (
          <Text style={styles.locationText}>
            {country} - {city}
          </Text>
        ) : (
          <Text style={styles.locationText}>تم تحديد الموقع تلقائياً</Text>
        )}
      </View>
    </View>
  ) : (
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
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  nextPrayer: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 15,
  },
});
