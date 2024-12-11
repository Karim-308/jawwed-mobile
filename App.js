import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import MoshafScreen from './src/screens/moshaf/MoshafScreen';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        await Font.loadAsync({
          'UthmanicHafs': require('./src/assets/fonts/Hafs.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading fonts: ', error);
      }
    };

    loadAppResources();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EFB975" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MoshafScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background for the mushaf page
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
