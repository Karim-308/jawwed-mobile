import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import getBookmarks from '../../../../api/bookmark/GetBookmark';
import deleteBookmark from '../../../../api/bookmark/DeleteBookmark';
import { useState, useEffect } from 'react';

const AyahTooltip = ({ ayahText, ayahKey, onShare, onPlay, onBookmark , style}) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const fetchedBookmarks = await getBookmarks();
        setBookmarks(fetchedBookmarks);
        setIsBookmarked(fetchedBookmarks.some(bookmark => bookmark.verseKey === ayahKey));
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, [ayahKey]);

  return (
    console.log("AyahTooltip"),
    <View style={[styles.tooltipContainer, style]}>
      {/*<Text style={styles.ayahText}>{ayahText}</Text>*/}
      <View style={styles.iconContainer}>
        {/* Share Button */}
        <TouchableOpacity onPress={() => onShare(ayahText, ayahKey)} style={styles.icon}>
          <Feather name="share-2" size={22} color="#EFB975" />
        </TouchableOpacity>

        {/* Play Button */}
        <TouchableOpacity onPress={() => onPlay(ayahKey)} style={styles.icon}>
          <Ionicons name="play" size={22} color="#EFB975" />
        </TouchableOpacity>

        {/* Bookmark Button */}
        <TouchableOpacity onPress={() => {
          if (isBookmarked) {
            deleteBookmark(2, ayahKey);
          } else {
            onBookmark(ayahKey);
          }
          setIsBookmarked(!isBookmarked);
        }} style={styles.icon}>
          <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color="#EFB975" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    zIndex: 100,
    position: 'absolute',
    // Position above the Ayah
    width: "40%",
    backgroundColor: '#272727',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EFB975',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    flexDirection: 'column',
    alignItems: 'center',
  },
  ayahText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  iconContainer: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  icon: {
    padding: 10,
  },
});

export default AyahTooltip;
