import React from 'react';
import { View, StyleSheet } from 'react-native';

const BlankNavBar = () => {
  return (
    <View style={styles.navbar}></View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'black',
    height: 30, // Adjust the height as needed
  },
});

export default BlankNavBar;