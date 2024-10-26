import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="arrow-back-sharp" size={24} color="#EFB975" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.surahName}>سورة البقرة</Text>
        <Text style={styles.juzInfo}>الجزء1, ثلاثة أرباع الحزب</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color="#EFB975" />
        </TouchableOpacity>
        <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#EFB975" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#000',
    minWidth: '100%',
    height: 60,
  },
  titleContainer: {
    marginHorizontal: 10,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#EFB975',
    padding: 5,
  },
  surahName: {
    color: '#EFB975',
    fontSize: 12,
    fontWeight: 'bold',
  },
  juzInfo: {
    color: '#EFB975',
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
});

export default Header;
