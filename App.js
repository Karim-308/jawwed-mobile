import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import * as Font from 'expo-font';
import { PRIMARY_GOLD } from './src/constants/colors';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './src/redux/store';
import HomeScreen from './src/screens/home/HomeScreen';
import MoshafIndexScreen from './src/screens/moshaf-index/MoshafIndexScreen';
import MoshafScreen from './src/screens/moshaf/MoshafScreen';
import BookmarkScreen from './src/screens/bookmark/BookmarkScreen';
import MoshafHeader from './src/screens/moshaf/components/MoshafHeader'

const Stack = createStackNavigator();

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
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#000', elevation: 0, shadowOpacity: 0 }, // Remove shadow for Android
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitleVisible: false, // Removes back text for iOS
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} 
            options={{ 
              title: 'الصفحة الرئيسية',
              headerTitleStyle: {
                fontFamily: 'UthmanicHafs',
                fontSize: 30
              },
              headerTitleAlign: 'center' 
            }}
          />
          <Stack.Screen
            name="IndexPage"
            component={MoshafIndexScreen}
            options={{ 
              title: 'الفهرس',
              headerTitleStyle: {
                fontFamily: 'UthmanicHafs',
                fontSize: 30
              },
              headerTitleAlign: 'center'
             }}
          />
          <Stack.Screen
            name="MoshafPage"
            component={MoshafScreen}
            options={{
              title: <MoshafHeader />,
              headerTintColor: `${PRIMARY_GOLD}`,
              headerTitleStyle: {
                fontFamily: 'UthmanicHafs',
                fontSize: 30
              },
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#000',
              },
            }}
          />
          <Stack.Screen
            name="BookmarkPage"
            component={BookmarkScreen}
            options={{
              title: 'الإشارات المرجعية',
              headerTitleStyle: {
                fontFamily: 'UthmanicHafs',
                fontSize: 30
              },
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#000', // Dark background for the app
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
