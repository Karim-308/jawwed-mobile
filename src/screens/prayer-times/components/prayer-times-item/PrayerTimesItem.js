import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getItemBackgroundColor } from './PrayerTimesItemFunctions';

export default function PrayerTimesItem({prayer}) {

  return (
      <View style={[styles.prayerTimesCard, {backgroundColor: getItemBackgroundColor(prayer.name)}]}>
        <Text style={styles.prayerTime}>{prayer.time}</Text>
        <Text style={styles.PrayerName}>{prayer.name}</Text>
      </View>
  );
}


const styles = StyleSheet.create({
    prayerTimesCard: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 3,
      borderRadius: 10,
      margin: 15,
      marginVertical: 5
    },
    PrayerName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height:1},
      textShadowRadius: 5,
      marginHorizontal: 12
    },
    prayerTime: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      width: 75,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height:1},
      textShadowRadius: 5,
      marginHorizontal: 12
    }
});