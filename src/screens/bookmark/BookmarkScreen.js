import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import * as Font from 'expo-font';
import Header from './components/BookmarkHeader';
import Body from './components/BookmarkBody';
import getBookmarks from '../../api/bookmark/GetBookmark';
import deleteBookmark from '../../api/bookmark/DeleteBookmark';
import { useSelector } from 'react-redux';
import NotLoggedInMessage from '../profile/components/NotLoggedInMessage';
import { get } from '../../utils/localStorage/secureStore';
import Colors from '../../constants/newColors'; // Using your existing color constants!

const BookmarkScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await get('userToken');
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const loadDarkMode = async () => {
      const storedDarkMode = await get('darkMode');
      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === 'true');
      } else {
        setDarkMode(true);
      }
    };
    loadDarkMode();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
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

  const handleDelete = async (userId, verseKey) => {
    try {
      await deleteBookmark(userId, verseKey);
      setBookmarks((prev) => prev.filter((b) => b.verseKey !== verseKey));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  if (isLoggedIn === null) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={Colors.highlight} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <NotLoggedInMessage />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
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
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={Colors.highlight} />
          ) : null
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
    backgroundColor: '#e0e0e0',
    opacity: 0.18,
    marginVertical: 10,
  },
});

export default BookmarkScreen;
