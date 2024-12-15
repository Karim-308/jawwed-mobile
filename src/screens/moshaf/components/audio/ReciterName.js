import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../../constants/colors';

export default function ReciterName() {
  return (
    <TouchableOpacity style={styles.touchable}>
      <View style={styles.container}>
        <AntDesign name="sound" size={20} color={PRIMARY_GOLD} />
        <Text style={styles.reciterNameText}>مشاري العفاسي</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    // Optional styling to make the touchable area larger
    padding: 5,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: PRIMARY_GOLD,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5, // Add vertical padding for better spacing
  },
  reciterNameText: {
    color: '#fff',
    fontSize: 16, // Optional: Adjust the font size for better readability
    marginLeft: 8, // Add spacing between icon and text
  },
});
