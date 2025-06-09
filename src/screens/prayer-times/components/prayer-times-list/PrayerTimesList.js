import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PrayerTimes, SunnahTimes } from 'adhan';
import { getTimeZone } from '../../../../api/services/timezone/TimezoneService';
import { ENV } from '../../../../../env';
import PrayerTimesItem from '../prayer-times-item/PrayerTimesItem';
import { setPrayerTimes, setTimeZone, setIsSettingsMenuVisible, setErrorStatus } from '../../../../redux/reducers/prayerTimesReducer';
import { getCalculationMethodParam, getMazhabParam } from './PrayerTimesListFunctions';
import { formatTime } from '../../../../utils/date-time-utils/DateTimeUtils';
import { toArabicNumerals } from '../../../../utils/helpers';


export default function PrayerTimesList() {

    const dispatch = useDispatch();

    const prayerTimes = useSelector((state) => state.prayerTimes.prayerTimes);
    const assignPrayerTimes = (prayerTimes) => {
        dispatch(setPrayerTimes(prayerTimes));
    }

    const [sunnahTimes, setSunnahTimes] = useState(null);

    const mazhab = useSelector((state) => state.prayerTimes.mazhab);
    const calculationMethod = useSelector((state) => state.prayerTimes.calculationMethod);
    const coordinates = useSelector((state) => state.prayerTimes.coordinates);

    const timeZone = useSelector((state) => state.prayerTimes.timeZone);
    const assignTimeZone = (timeZone) => {
        dispatch(setTimeZone(timeZone));
    }

    // Settings Menu
    const assignIsSettingsMenuVisible = (isSettingsMenuVisible) => {
        dispatch(setIsSettingsMenuVisible(isSettingsMenuVisible));
    }

    const assignErrorStatus = (errorStatus) => {
        dispatch(setErrorStatus(errorStatus));
    }

    const apiKey = ENV.development.TIMEZONE_FROM_COORDINATES_API_KEY;

    // Update the timezone if coordinates changed then trigger the update of prayer and sunnah times
    useEffect(() => {

        const updateTimeZone = async () => {
            const timezoneInfo = await getTimeZone(apiKey, coordinates.latitude, coordinates.longitude);
            if(timezoneInfo.errorStatus === null)
                assignTimeZone({
                    'zoneName': timezoneInfo.zoneName,
                    'gmtOffset': timezoneInfo.gmtOffset
                });
            else
                assignErrorStatus(timezoneInfo.errorStatus);
        }

        if(coordinates !== null)
            updateTimeZone();
        else
            assignTimeZone(null);

    }, [coordinates]);

    // Update the prayer and sunnah times
    useEffect(() => {

        const getPrayerTimes = async() => {
            if (coordinates && timeZone && calculationMethod && mazhab) {
                const prayerTimesParameters = getCalculationMethodParam(calculationMethod);
                prayerTimesParameters.madhab = getMazhabParam(mazhab);
                const date = new Date();
                const currentPrayerTimes = new PrayerTimes(coordinates, date, prayerTimesParameters);
                const currentSunnahTimes = new SunnahTimes(currentPrayerTimes);
                assignPrayerTimes(currentPrayerTimes);
                setSunnahTimes(currentSunnahTimes);
            }
            else {
                assignPrayerTimes(null);
                setSunnahTimes(null);
            }
        }

        getPrayerTimes();

    }, [timeZone, calculationMethod, mazhab]);


    return (
        <View style={styles.container}>

            {(prayerTimes && sunnahTimes && timeZone)? (
            <View style={styles.paryerTimesList}>           
                <PrayerTimesItem prayer={{name: 'الفجر', time: toArabicNumerals(formatTime(prayerTimes.fajr))}}/>
                <PrayerTimesItem prayer={{name: 'الشروق', time: toArabicNumerals(formatTime(prayerTimes.sunrise))}}/>
                <PrayerTimesItem prayer={{name: 'الظهر', time: toArabicNumerals(formatTime(prayerTimes.dhuhr))}}/>
                <PrayerTimesItem prayer={{name: 'العصر', time: toArabicNumerals(formatTime(prayerTimes.asr))}}/>
                <PrayerTimesItem prayer={{name: 'المغرب', time: toArabicNumerals(formatTime(prayerTimes.maghrib))}}/>
                <PrayerTimesItem prayer={{name: 'العشاء', time: toArabicNumerals(formatTime(prayerTimes.isha))}}/>
                <PrayerTimesItem prayer={{name: 'منتصف الليل', time: toArabicNumerals(formatTime(sunnahTimes.middleOfTheNight))}}/>
                <PrayerTimesItem prayer={{name: 'ثلث الليل الأخير', time: toArabicNumerals(formatTime(sunnahTimes.lastThirdOfTheNight))}}/>
            </View>
            ) : (
                <View style={styles.messageContainer}>
                    <Text style={styles.text}>من فضلك، اضبط الإعدادات حتى يتم عرض مواقيت الصلاة</Text>
                    <TouchableOpacity onPress={() => assignIsSettingsMenuVisible(true)}>
                        <Text style={styles.settingsButton}>الإعــدادات</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%'
    },
    paryerTimesList: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'streatch',
        marginBottom: '5%'
    },
    messageContainer: {
        flex: 0.25,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        direction: 'rtl',
        width: '90%',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#FFF',
        margin: 10
    },
    settingsButton: {
        fontSize: 16,
        color: 'white',
        backgroundColor: '#DE9953',
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
});