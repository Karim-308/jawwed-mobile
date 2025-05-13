import React from 'react';
import { StyleSheet , SafeAreaView, View } from 'react-native';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import PrayerTimesHeader from './components/prayer-times-header/PrayerTimesHeader';
import PrayerTimesClock from './components/prayer-times-clock/PrayerTimesClock';
import PrayerTimesList from './components/prayer-times-list/PrayerTimesList';
import PrayerTimesSettingsMenu from './components/prayer-times-settings-menu/PrayerTimesSettingsMenu';
import PrayerTimesNotificationsMenu from './components/prayer-times-notifications-menu/PrayerTimesNotificationsMenu';
import PrayerTimesErrorMessage from './components/prayer-times-error-message/PrayerTimesErrorMessage';
import { PRIMARY_GOLD } from '../../constants/colors';


export default function PrayerTimesScreen() {

    return (
        <Provider store={store}>
            <SafeAreaView style={styles.prayerTimesScreen}>
                <View style={styles.prayerTimesScreenClock}>
                    <PrayerTimesClock />
                </View>
                <View style={styles.prayerTimesScreenHeader}>
                    <PrayerTimesHeader />
                </View>
                <PrayerTimesSettingsMenu />
                <PrayerTimesNotificationsMenu />
                <PrayerTimesErrorMessage />
                <PrayerTimesList />
            </SafeAreaView>
        </Provider>
    );
}


const styles = StyleSheet.create({
    prayerTimesScreen: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        borderWidth: 5,
        borderColor: PRIMARY_GOLD,
        borderTopLeftRadius: 200,
        borderTopRightRadius: 200
    },
    prayerTimesScreenClock: {
        flex: 0.25,
        top: '15%',
        width: '50%',
        marginBottom: '15%'

    },
    prayerTimesScreenHeader: {
        flex: 0.25,
        right: '30%',
        bottom: '7%',
    }
});