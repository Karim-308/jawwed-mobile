import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import QuranBookmarkScreen from "./QuranBookmarkScreen";
import AzkarBookmarkScreen from "./AzkarBookmarkScreen";
import Colors from "../../constants/newColors";
import { get } from "../../utils/localStorage/secureStore";
import { useFocusEffect } from "@react-navigation/native";
import NotLoggedInMessage from "../profile/components/NotLoggedInMessage";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BookmarkTabs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  useEffect(() => {
    const loadDarkMode = async () => {
      const storedDarkMode = await get("darkMode");
      const token = await get("userToken");
      setDarkMode(storedDarkMode === "true");
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    loadDarkMode();
  }, []);

  const currentColors = darkMode ? Colors.dark : Colors.light;

  const screens = [
    {
      key: "quran",
      image: require("../../assets/images/quran-bookmark-icon.png"),
      label: "الآيات",
      Component: QuranBookmarkScreen,
    },
    {
      key: "azkar",
      image: require("../../assets/images/azkar-bookmark-icon.png"),
      label: "الأذكار",
      Component: AzkarBookmarkScreen,
    },
  ];

  if (isLoading || isLoggedIn === null) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.highlight} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <NotLoggedInMessage />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <FlatList
        ref={flatListRef}
        data={screens}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const { Component } = item;
          const isTabFocused = index === currentIndex && isFocused;
          return (
            <View style={{ width: SCREEN_WIDTH }}>
              <Component
                darkMode={darkMode}
                focused={isTabFocused}
                isTabActive={isFocused}
              />
            </View>
          );
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentIndex(newIndex);
        }}
      />

      {/* Icon Bar with Rectangular Backgrounds */}
      <View style={styles.tabBar}>
        {screens.map((screen, i) => {
          const isActive = i === currentIndex;
          return (
            <TouchableOpacity
              key={screen.key}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: i,
                  animated: true,
                });
                setCurrentIndex(i);
              }}
              style={[
                styles.iconTabContainer,
                {
                  backgroundColor: isActive
                    ? Colors.highlight
                    : darkMode
                    ? "#222"
                    : "#f0f0f0",
                },
              ]}
              activeOpacity={0.8}
            >
              <Image
                source={screen.image}
                style={{
                  width: screen.key === "quran" ? 30 : 50,
                  height: screen.key === "quran" ? 28 : 28,
                  tintColor: isActive ? "#fff" : darkMode ? "#aaa" : "#333",
                  resizeMode: "contain",
                }}
              />

              <View
                style={[
                  styles.indicatorSegment,
                  {
                    backgroundColor: isActive
                      ? "#fff"
                      : darkMode
                      ? "#444"
                      : "#ccc",
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconTabContainer: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  indicatorSegment: {
    width: 30,
    height: 4,
    marginTop: 6,
    borderRadius: 2,
  },
});

export default BookmarkTabs;
