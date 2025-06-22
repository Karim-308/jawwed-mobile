import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import TasmeeMainScreen from './components/TasmeeBody';

const TasmeeScreen  = () => {
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TasmeeMainScreen />
        </View>
      </SafeAreaView>
  );
};

export default TasmeeScreen ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Match the background color with the app
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 0, // Remove unnecessary gaps
  },
});
