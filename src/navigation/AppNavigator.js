import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "../screens/home/HomeScreen";
import MoshafIndexScreen from "../screens/moshaf-index/MoshafIndexScreen";
import MoshafScreen from "../screens/moshaf/MoshafScreen";
import BookmarkScreen from "../screens/bookmark/BookmarkScreen";
import Header from "../screens/moshaf/components/MoshafHeader";
import { PRIMARY_GOLD } from "../constants/colors";
import LoginScreen from "../screens/login/LoginScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import AzkarCategories from "../screens/azkar/AzkarCategoriesScreen";
import AzkarDetails from "../screens/azkar/components/AzkarDetails";
import PrayerTimesScreen from "../screens/prayer-times/PrayerTimesScreen";
import QiblahCompass from "../screens/qiblah/QiblahScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <StatusBar style="light" />
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IndexPage"
        component={MoshafIndexScreen}
        options={{
          title: "الفهرس",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="BookmarkPage"
        component={BookmarkScreen}
        options={{
          title: "الإشارات المرجعية",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="MoshafPage"
        component={MoshafScreen}
        options={{
          headerTitle: () => <Header />,
          headerTintColor: `${PRIMARY_GOLD}`,
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#000",
          },
        }}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfileScreen}
        options={{
          title: "الملف الشخصي",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="AzkarPage"
        component={AzkarCategories}
        options={{
          title: "الأذكار",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="AzkarDetailsPage"
        component={AzkarDetails}
        options={({ route }) => ({
          title: route.params?.title || "الأذكار", // ✅ fallback Arabic title
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        })}
      />

      <Stack.Screen
        name="QuizPage"
        component={QuizScreen}
        options={{
          title: "Quiz",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="PrayerTimesPage"
        component={PrayerTimesScreen}
        options={{
          title: "مواقيت الصلاة",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="QiblahPage"
        component={QiblahCompass}
        options={{
          title: "اتجاه القِبلة",
          headerTitleStyle: {
            fontFamily: "UthmanicHafs",
            fontSize: 30,
          },
          headerTitleAlign: "center",
        }}
      />

    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
