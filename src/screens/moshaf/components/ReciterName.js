import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../constants/colors';

export default function ReciterName({name}) {
  return (
    <View style={styles.container}>
      <Text style={styles.reciterNameText}>{name}</Text>
      <MaterialIcons name="volume-up" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: PRIMARY_GOLD,
    borderWidth: 1,
    borderRadius: 10,
    height: 45
  },
  reciterNameText: {
    width: 180,
    textAlign: 'right',
    color: '#fff',
    fontSize: 16,
    marginRight: 10
  },
  icon: {
    fontSize: 24,
    color: `${PRIMARY_GOLD}`,
    transform: [{rotate: '180deg'}],
    marginRight: 20
  }
});
