import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Text,
} from "react-native";
import * as Font from "expo-font";
import Header from "./components/BookmarkHeader";
import Body from "./components/BookmarkBody";
import getBookmarks from "../../api/bookmark/GetBookmark";
import deleteBookmark from "../../api/bookmark/DeleteBookmark";
import { useSelector } from "react-redux";
import NotLoggedInMessage from "../profile/components/NotLoggedInMessage";
import { get } from "../../utils/localStorage/secureStore";
import Colors from "../../constants/newColors"; // Using your existing color constants!
import BookmarkListHeader from "./components/BookmarkHeader";

const QuranBookmarkScreen = ({ darkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await get("userToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();

      // Filter only verse bookmarks (bookmarkType 0)
      const verseBookmarks = data.filter((b) => b.bookmarkType === 0);

      setBookmarks(verseBookmarks);
    } catch (err) {
      setError("Failed to load bookmarks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchBookmarks();
  }, [isLoggedIn]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookmarks();
    setRefreshing(false);
  };

  const handleDelete = async (verseKey) => {
    try {
      await deleteBookmark({
        identifier: verseKey,
        type: 0, // Assuming type 0 is for verse bookmarks
      });
      setBookmarks((prev) => prev.filter((b) => b.verseKey !== verseKey));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  if (isLoggedIn === null) {
    return (
      <View
        style={[
          styles.container,
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
          styles.container,
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
        data={bookmarks}
        keyExtractor={(item) => item.verseKey}
        renderItem={({ item }) => (
          <Body
            bookmarks={[item]}
            loading={false}
            error={null}
            handleDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.highlight]}
            progressBackgroundColor={currentColors.background}
          />
        }
        ListHeaderComponent={
          <BookmarkListHeader title="الآيات" darkMode={darkMode} />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={Colors.highlight} />
          ) : (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: currentColors.text, fontSize: 20 }}>
                لا توجد إشارات مرجعية حتى الآن
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    opacity: 0.18,
    marginVertical: 10,
  },
});

export default QuranBookmarkScreen;
