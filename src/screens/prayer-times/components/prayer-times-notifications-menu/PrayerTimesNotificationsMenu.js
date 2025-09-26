import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  setIsNotificationsMenuVisible,
  switchIsPrayerTimesNotificationsActive,
  switchIsMuteDuringPrayerTimesActive,
  setErrorStatus,
} from '../../../../redux/reducers/prayerTimesReducer';
import { requestNotificationsPermission } from '../../../../utils/notifications-utils/NotificationsUtils';
import { save } from '../../../../utils/localStorage/secureStore';
import { PRIMARY_GOLD, DARK_GREY, DARK_GOLD } from '../../../../constants/colors';

export default function PrayerTimesNotificationsMenu() {
  const dispatch = useDispatch();

  // Notifications Menu
  const isNotificationsMenuVisible = useSelector(
    (state) => state.prayerTimes.isNotificationsMenuVisible
  );
  const assignIsNotificationsMenuVisible = (notificationsMenuVisible) => {
    dispatch(setIsNotificationsMenuVisible(notificationsMenuVisible));
  };

  const isPrayerTimesNotificationsActive = useSelector(
    (state) => state.prayerTimes.isPrayerTimesNotificationsActive
  );
  const toggleIsPrayerTimesNotificationsActive = () => {
    dispatch(switchIsPrayerTimesNotificationsActive());
    save(
      'isPrayerTimesNotificationsActive',
      String(!isPrayerTimesNotificationsActive)
    );
  };

  const isMuteDuringPrayerTimesActive = useSelector(
    (state) => state.prayerTimes.isMuteDuringPrayerTimesActive
  );
  const toggleIsMuteDuringPrayerTimesActive = () => {
    dispatch(switchIsMuteDuringPrayerTimesActive());
    save(
      'isMuteDuringPrayerTimesActive',
      String(!isMuteDuringPrayerTimesActive)
    );
  };

  const assignErrorStatus = (errorStatus) => {
    dispatch(setErrorStatus(errorStatus));
  };

  let notificationPermissionResponse = null;

  useEffect(() => {
    const getNotificationsPermission = async () => {
      if (isPrayerTimesNotificationsActive === true) {
        notificationPermissionResponse = await requestNotificationsPermission();
        if (notificationPermissionResponse.status !== 'granted') {
          toggleIsPrayerTimesNotificationsActive();
          assignErrorStatus(notificationPermissionResponse.errorStatus);
        }
      }
    };

    getNotificationsPermission();
  }, [isPrayerTimesNotificationsActive]);

  return (
    <View>
      {/****************************** Notifications Menu Modal ******************************/}
      <Modal
        visible={isNotificationsMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => assignIsNotificationsMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => assignIsNotificationsMenuVisible(false)}
            >
              <Ionicons
                name="close-circle-outline"
                size={30}
                color={PRIMARY_GOLD}
              />
            </TouchableOpacity>

            {/* Menu Title */}
            <Text style={styles.modalTitle}>الإشعـــارات</Text>

            {/* Menu Options */}
            <View style={styles.menuOptionsContainer}>
              {/* 1- Prayer Times Notifications Option */}
              <View style={styles.optionContainer}>
                <Switch
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                  trackColor={{ false: DARK_GREY, true: PRIMARY_GOLD }}
                  thumbColor={
                    isPrayerTimesNotificationsActive ? DARK_GOLD : DARK_GREY
                  }
                  onValueChange={toggleIsPrayerTimesNotificationsActive}
                  value={isPrayerTimesNotificationsActive}
                />
                <Text style={styles.optionLabel}>تفعيـل الإشعــارات</Text>
              </View>

              {/* 2- Mute During Prayer Times Option */}
              <View style={styles.optionContainer}>
                <Switch
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                  trackColor={{ false: DARK_GREY, true: PRIMARY_GOLD }}
                  thumbColor={
                    isMuteDuringPrayerTimesActive ? DARK_GOLD : DARK_GREY
                  }
                  onValueChange={toggleIsMuteDuringPrayerTimesActive}
                  value={isMuteDuringPrayerTimesActive}
                />
                <Text style={styles.optionLabel}>صامت أثناء الصلاة</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/*********************************************************************************/}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    height: '50%',
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_GOLD,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  modalItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
    marginVertical: 5,
    color: PRIMARY_GOLD,
    direction: 'rtl',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  menuOptionsContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '85%',
  },
  optionLabel: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    width: '50%',
  },
});
