import React from 'react';
import { StyleSheet , SafeAreaView, View} from 'react-native';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import PrayerTimesHeader from './components/prayer-times-header/PrayerTimesHeader';
import PrayerTimesClock from './components/prayer-times-clock/PrayerTimesClock';
import PrayerTimesList from './components/prayer-times-list/PrayerTimesList';
import PrayerTimesSettingsMenu from './components/prayer-times-settings-menu/PrayerTimesSettingsMenu';
import PrayerTimesErrorMessage from './components/prayer-times-error-message/PrayerTimesErrorMessage';


export default function PrayerTimesScreen() {

    return (
        <Provider store={store}>
            <SafeAreaView style={styles.prayerTimesScreen}>
                <View style={styles.prayerTimesScreenTop}>
                    <View style={styles.prayerTimesScreenHeader}>
                        <PrayerTimesHeader />
                    </View>
                    <View style={styles.prayerTimesScreenClock}>
                        <PrayerTimesClock />
                    </View>
                </View>
                <PrayerTimesSettingsMenu />
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
        backgroundColor: '#000'
    },
    prayerTimesScreenTop: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '5%',
        backgroundColor: '#000'
    },
    prayerTimesScreenHeader: {
        
    },
    prayerTimesScreenClock: {
        marginHorizontal: '4%',
        width: '75%'
    }
});