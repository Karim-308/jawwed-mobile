import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlay, hideNav, showNav } from '../../../redux/reducers';
import { toggleAudio } from '../Services/AudioService';
import { PRIMARY_GOLD, DARK_GREY } from '../../../constants/colors';

/**
 * Secondary navigation bar component that displays playback controls 
 * and information when media is playing. Allows users to toggle play/pause, 
 * repeat, and hide/show the bottom navigation.
 */
const IsPlay = () => {
  const dispatch = useDispatch();

  // Select states from Redux
  const isPlaying = useSelector((state) => state.isPlaying);
  const isVisible = useSelector((state) => state.isVisible);

  // Toggles play/pause state
  const handleTogglePlay = () => {
    dispatch(togglePlay());
  };

  // Hides the navigation bar
  const handleHide = () => {
    dispatch(hideNav());
  };

  // Shows the navigation bar
  const handleShow = () => {
    dispatch(showNav());
  };

  return (
    <View style={styles.container}>
      {/* Gold Line Block */}
      <View style={styles.goldLineBlock}>
        <View style={styles.goldLine} />
      </View>

      <View style={styles.goldLineBackground}></View>

      {/* Left Icon: Speaker Icon */}
      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.speakerButton}>
          <MaterialIcons name="volume-up" size={18} color={PRIMARY_GOLD} />
          <Text style={styles.speakerText}>مشاري العفاسي</Text>
        </TouchableOpacity>
      </View>

      {/* Center Icon: Page Number */}
      <View style={styles.centerIcon}>
        <View style={styles.centerShape}>
          <Text style={styles.centerText}>٦</Text>
        </View>
      </View>

      {/* Right Icons */}
      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="repeat-outline" size={24} color={PRIMARY_GOLD} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={handleHide}>
          <MaterialIcons name="close" size={24} color={PRIMARY_GOLD} />
        </TouchableOpacity>

        {/* Play/Pause Button */}
        <View style={styles.playButton}>
          <TouchableOpacity onPress={() => {
            toggleAudio(isPlaying);
            dispatch(togglePlay());
          }}>
            <Ionicons name={isPlaying ? "pause-outline" : "play-outline"} size={40} color={PRIMARY_GOLD} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Up Arrow for showing navigation */}
      <TouchableOpacity style={[styles.icon, styles.upArrow]} onPress={handleShow}>
        <MaterialIcons name="keyboard-arrow-up" size={24} color={PRIMARY_GOLD} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DARK_GREY,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  goldLineBlock: {
    position: 'absolute',
    top: -15,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  goldLine: {
    height: 2,
    backgroundColor: PRIMARY_GOLD,
  },
  goldLineBackground: {
    backgroundColor: DARK_GREY,
    height: 30,
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_GREY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: PRIMARY_GOLD,
    borderWidth: 1,
    borderRadius: 10,
  },
  speakerText: {
    color: PRIMARY_GOLD,
    marginLeft: 5,
  },
  centerIcon: {
    position: 'absolute',
    top: -15,
    left: '50%',
    alignItems: 'center',
  },
  centerShape: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: PRIMARY_GOLD,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DARK_GREY,
  },
  centerText: {
    color: PRIMARY_GOLD,
    fontSize: 15,
    fontWeight: 'bold',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    marginHorizontal: 10,
  },
  playButton: {
    top: -30,
    height: 50,
    width: 50,
    padding: 2,
    marginLeft: 35,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: DARK_GREY,
    borderColor: PRIMARY_GOLD,
    borderRadius: 20,
  },
  upArrow: {
    padding: 5,
  },
});

export default IsPlay;
