import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const AyahTooltip = ({ ayahText, ayahKey, onShare, onPlay, onBookmark , style}) => {
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
        <TouchableOpacity onPress={() => onBookmark(ayahKey)} style={styles.icon}>
          <Ionicons name="bookmark-outline" size={22} color="#EFB975" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
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
