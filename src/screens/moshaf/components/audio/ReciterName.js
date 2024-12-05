import React from 'react';
import { StyleSheet , View , Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../../constants/colors';

export default function ReciterName() {
  return (
      <TouchableOpacity>
        <View style={styles.container}>
          <AntDesign name='sound' size={20} color={PRIMARY_GOLD} />
          <Text styel={styles.reciterNameText}>مشاري العفاسي</Text>
        </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: `${PRIMARY_GOLD}`,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  reciterNameText: {
    color:'#fff',
  }
});
