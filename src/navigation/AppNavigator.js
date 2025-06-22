import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

import Colors from "../constants/newColors";
import HomeScreen from "../screens/home/HomeScreen";
import MoshafIndexScreen from "../screens/moshaf-index/MoshafIndexScreen";
import MoshafScreen from "../screens/moshaf/MoshafScreen";
import BookmarkTabs from "../screens/bookmark/BookmarkTabs";
import Header from "../screens/moshaf/components/MoshafHeader";
import LoginScreen from "../screens/login/LoginScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import AzkarCategories from "../screens/azkar/AzkarCategoriesScreen";
import AzkarDetails from "../screens/azkar/components/AzkarDetails";
import PrayerTimesScreen from "../screens/prayer-times/PrayerTimesScreen";
import QiblahCompass from "../screens/qiblah/QiblahScreen";
import MasbahaScreen from "../screens/masbaha/MasbahaScreen";
import TasmeeScreen from "../screens/tasmee/TasmeeScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const currentColors = darkMode ? Colors.dark : Colors.light;

  // ⚠️ Force re-render of NavigationContainer
  const themeKey = darkMode ? "dark" : "light";

  // Memoize screenOptions to prevent unnecessary recomputes
  const screenOptions = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: currentColors.headerBackground,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: currentColors.text,
      headerTitleStyle: {
        fontFamily: "UthmanicHafs",
        fontSize: 30,
        color: currentColors.text,
      },
      headerBackTitleVisible: false,
      headerTitleAlign: "center",
    }),
    [darkMode]
  );

  return (
    <NavigationContainer key={themeKey}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
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
          options={{ title: "الفهرس" }}
        />
        <Stack.Screen
          name="BookmarkPage"
          component={BookmarkTabs}
          options={{ title: "الإشارات المرجعية" }}
        />
        <Stack.Screen
          name="MoshafPage"
          component={MoshafScreen}
          options={{
            headerTitle: () => <Header />,
            headerTintColor: currentColors.text,
            headerStyle: {
              backgroundColor: currentColors.background,
            },
          }}
        />
        <Stack.Screen
          name="ProfilePage"
          component={ProfileScreen}
          options={{ title: "الملف الشخصي" }}
        />
        <Stack.Screen
          name="AzkarPage"
          component={AzkarCategories}
          options={{ title: "الأذكار" }}
        />
        <Stack.Screen
          name="AzkarDetailsPage"
          component={AzkarDetails}
          options={({ route }) => ({
            title: route.params?.title || "الأذكار",
          })}
        />
        <Stack.Screen
          name="QuizPage"
          component={QuizScreen}
          options={{ title: "اختبار القرآن" }}
        />
        <Stack.Screen
          name="PrayerTimesPage"
          component={PrayerTimesScreen}
          options={{ title: "مواقيت الصلاة" }}
        />
        <Stack.Screen
          name="QiblahPage"
          component={QiblahCompass}
          options={{ title: "اتجاه القِبلة" }}
        />
        <Stack.Screen
          name="MasbahaPage"
          component={MasbahaScreen}
          options={{ title: "سبحة" }}
        />
        <Stack.Screen
          name="TasmeePage"
          component={TasmeeScreen}
          options={{
            headerTitle: () => <Header />,
            headerTintColor: currentColors.text,
            headerStyle: {
              backgroundColor: currentColors.background,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
