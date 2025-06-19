//src/screens/bookmark/BookmarkTabs.js
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import QuranBookmarkScreen from "./QuranBookmarkScreen";
import AzkarBookmarkScreen from "./AzkarBookmarkScreen";
import Colors from "../../constants/newColors";
import { get } from "../../utils/localStorage/secureStore";
import { useFocusEffect } from "@react-navigation/native";
import NotLoggedInMessage from "../profile/components/NotLoggedInMessage";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BookmarkTabs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Focus detection when navigating in/out of BookmarkTabs screen
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false); // on screen blur
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
    { key: "quran", Component: QuranBookmarkScreen },
    { key: "azkar", Component: AzkarBookmarkScreen },
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

      {/* Thin Indicator Bar */}
      <View style={styles.indicatorWrapper}>
        {screens.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicatorSegment,
              {
                backgroundColor:
                  i === currentIndex
                    ? Colors.highlight
                    : darkMode
                    ? "#444"
                    : "#ccc",
              },
            ]}
          />
        ))}
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
  indicatorWrapper: {
    flexDirection: "row",

    height: 7,
    width: "100%",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  indicatorSegment: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 2,
  },
});

export default BookmarkTabs;
