import React from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setIsSettingsMenuVisible, setIsNotificationsMenuVisible } from '../../../../redux/reducers/prayerTimesReducer';
import { PRIMARY_GOLD } from '../../../../constants/colors';


export default function PrayerTimesHeader() {

    const prayerTimes = useSelector((state) => state.prayerTimes.prayerTimes);

    const dispatch = useDispatch();

    // Settings Menu
    const assignIsSettingsMenuVisible = (isSettingsMenuVisible) => {
        dispatch(setIsSettingsMenuVisible(isSettingsMenuVisible));
    }
    // Notifications Menu
    const assignIsNotificationsMenuVisible = (notificationsMenuVisible) => {
        dispatch(setIsNotificationsMenuVisible(notificationsMenuVisible));
    }


    return (
        (prayerTimes)?
        <View style={styles.headerContainer}>
            {/*Settings Icon*/}
            <TouchableOpacity style={styles.settingsButton} onPress={() => assignIsSettingsMenuVisible(true)}>
                <Ionicons name='settings-outline' size={28} color={PRIMARY_GOLD} />
            </TouchableOpacity>

            {/*Notifications Icon*/}
            <TouchableOpacity style={styles.notificationsButton} onPress={() => assignIsNotificationsMenuVisible(true)}>
                <Ionicons name='notifications-outline' size={30} color={PRIMARY_GOLD} />
            </TouchableOpacity>
        </View>
        :
        <></>
    );
}


const styles = StyleSheet.create({
    // Header Icons
    headerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});