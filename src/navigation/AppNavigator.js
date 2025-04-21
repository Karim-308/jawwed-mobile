import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/home/HomeScreen';
import MoshafIndexScreen from '../screens/moshaf-index/MoshafIndexScreen';
import MoshafScreen from '../screens/moshaf/MoshafScreen';
import BookmarkScreen from '../screens/bookmark/BookmarkScreen';
import Header from '../screens/moshaf/components/MoshafHeader';
import AzkarCategories from '../screens/azkar/AzkarCategoriesScreen';
import { PRIMARY_GOLD } from '../constants/colors';
import AzkarDetails from '../screens/azkar/components/AzkarDetails';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <StatusBar style="light" />
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#000', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="IndexPage"
        component={MoshafIndexScreen}
        options={{
          title: 'الفهرس',
          headerTitleStyle: {
            fontFamily: 'UthmanicHafs',
            fontSize: 30,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="BookmarkPage"
        component={BookmarkScreen}
        options={{
          title: 'الإشارات المرجعية',
          headerTitleStyle: {
            fontFamily: 'UthmanicHafs',
            fontSize: 30,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="MoshafPage"
        component={MoshafScreen}
        options={{
          headerTitle: () => <Header />,
          headerTintColor: `${PRIMARY_GOLD}`,
          headerTitleStyle: {
            fontFamily: 'UthmanicHafs',
            fontSize: 30,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      />
      <Stack.Screen
        name="AzkarPage"
        component={AzkarCategories}
        options={{
          title: 'الأذكار',
          headerTitleStyle: {
            fontFamily: 'UthmanicHafs',
            fontSize: 30,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      />
      <Stack.Screen
        name="AzkarDetails"
        component={AzkarDetails}
        options={{
          title: ' ',
          headerTitleStyle: {
            fontFamily: 'UthmanicHafs',
            fontSize: 30,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;