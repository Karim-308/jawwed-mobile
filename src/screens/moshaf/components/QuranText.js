import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuranText = () => {
  return (
    <View style={styles.container}>
      <View style={styles.decorativeBorder}></View>
      <Text style={styles.quranText}>
        BLANK PAGE
      </Text>
      <View style={styles.decorativeBorder}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    padding: 15,
  },
  quranText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 40,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  decorativeBorder: {
    borderWidth: 2,
    borderColor: 'gold',
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default QuranText;
