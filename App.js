import { LogBox } from 'react-native';
// Ignore all log notifications
LogBox.ignoreAllLogs(true);

// Override console methods
if (__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}


import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import IntroScreen from './src/screens/Intro/IntroScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

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

  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EFB975" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});