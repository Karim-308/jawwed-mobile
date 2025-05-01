import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Header from './components/BookmarkHeader';
import Body from './components/BookmarkBody';
import getBookmarks from '../../api/bookmark/GetBookmark';
import deleteBookmark from '../../api/bookmark/DeleteBookmark';
import { useSelector } from 'react-redux';
import NotLoggedInMessage from '../profile/components/NotLoggedInMessage';
import { get } from '../../utils/localStorage/secureStore'; // Adjust the import path as necessary
import { ActivityIndicator } from 'react-native';

const BookmarkScreen = () => {
  const [isLoggedIn,setIsLoggedIn] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await get('userToken');
      setIsLoggedIn(!!token); // true if token exists
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await getBookmarks();
        setBookmarks(data);
      } catch (err) {
        setError("Failed to load bookmarks");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) loadResources(); // ✅ only fetch if logged in
  }, [isLoggedIn]);

  const handleDelete = async (userId, verseKey) => {
    try {
      await deleteBookmark(userId, verseKey);
      setBookmarks((prev) => prev.filter((b) => b.verseKey !== verseKey));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };


if (isLoggedIn === null) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}


  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <NotLoggedInMessage />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Body
        bookmarks={bookmarks}
        loading={loading}
        error={error}
        handleDelete={handleDelete}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
});

export default BookmarkScreen;
