import { LogBox, I18nManager } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import IntroScreen from "./src/screens/Intro/IntroScreen";
import AppNavigator from "./src/navigation/AppNavigator";

LogBox.ignoreAllLogs(true);


// Lock layout direction immediately after imports to prevent metro bundling issues
// and to ensure that the app is always in RTL mode.
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        await Font.loadAsync({
          'UthmanicHafs': require('./src/assets/fonts/Hafs.ttf'),
          'digitalkhatt': require('./src/assets/fonts/digitalkhatt4.otf'),
          'PRO': require('./src/assets/fonts/AQEEQSANSPRO-Thin.otf'),
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
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
