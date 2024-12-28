import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Header from './components/BookmarkHeader';
import Body from './components/BookmarkBody';
import getBookmarks from '../../api/bookmark/GetBookmark';
import deleteBookmark from '../../api/bookmark/DeleteBookmark';

const BookmarkScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await Font.loadAsync({
          'UthmanicHafs': require('../../assets/fonts/Hafs.ttf'),
        });
        const data = await getBookmarks();
        setBookmarks(data);
      } catch (err) {
        setError('Failed to load bookmarks or fonts.');
        console.error(err);
      } finally {
        setFontLoaded(true);
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const handleDelete = async (userId, verseKey) => {
    try {
      await deleteBookmark(userId, verseKey);
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.verseKey !== verseKey)
      );
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/*<Header />*/}
      <Body
        bookmarks={bookmarks}
        loading={loading}
        error={error}
        fontLoaded={fontLoaded}
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
