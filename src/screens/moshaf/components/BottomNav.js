import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlay, hideNav, showNav } from '../../../redux/reducers';
import { toggleAudio } from '../Services/AudioService';
import IsPlay from './isPlayNavBar';
import { PRIMARY_GOLD, DARK_GREY } from '../../../constants/colors';


/**
 * Main bottom navigation bar component that displays a set of icons 
 * and a play/pause toggle. It conditionally renders either this 
 * navigation bar or the IsPlay component based on the isPlaying state.
 */

const BottomNavigationBar = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.isPlaying);
  const isVisible = useSelector((state) => state.isVisible);

  // Hides the navigation bar
  const handleHide = () => {
    dispatch(hideNav());
  };

  // Shows the navigation bar
  const handleShow = () => {
    dispatch(showNav());
  };

  return (
    <>
      {isPlaying ? (
        <IsPlay />
      ) : isVisible ? (
        <View style={styles.container}>
          {/* Gold Line Block */}
          <View style={styles.goldLineBlock}>
            <View style={styles.goldLine} /></View>
          <View style={styles.goldLineBackground}></View>

          {/* Left Icons */}
          <View style={[styles.iconGroup, styles.leftGroup]}>
            <TouchableOpacity style={styles.icon}>
              <Feather name="share-2" size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <MaterialIcons name="bookmark-border" size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <FontAwesome5 name="eye-slash" size={20} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => dispatch(togglePlay())} // Navigates to IsPlay by toggling play state
            >
              <MaterialIcons name="equalizer" size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>

            <View style={styles.playButton}>
              <TouchableOpacity onPress={() => {
                toggleAudio(isPlaying, '2:6', 'Alafasy');
                dispatch(togglePlay());
              }}>
                <Ionicons name={isPlaying ? "pause-outline" : "play-outline"} size={40} color={PRIMARY_GOLD} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Center Icon */}
          <View style={styles.centerIcon}>
            <View style={styles.centerShape}>
              <Text style={styles.centerText}>٦</Text>
            </View>
          </View>

          {/* Right Icon */}
          <TouchableOpacity style={styles.icon} onPress={handleHide}>  
            <MaterialIcons name="keyboard-arrow-down" size={24} color={PRIMARY_GOLD} />
          </TouchableOpacity>
        </View>
      ) : (
        // Page number and up arrow when navigation is hidden
        <View style={styles.hiddenContainer}>
          <View style={styles.pageNumberContainer}>
            <View style={styles.centerShape}>
              <Text style={styles.centerText}>٦</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleShow} style={styles.upArrow}>
            <MaterialIcons name="keyboard-arrow-up" size={24} color={PRIMARY_GOLD} />
          </TouchableOpacity>
        </View>
      )}
    </>
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
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  pageNumberContainer: {
    marginLeft: 175,
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
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 20,
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
  playButton: {
    top: -30,
    height: 50,
    width: 50,
    padding: 2,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: DARK_GREY,
    borderColor: PRIMARY_GOLD,
    borderRadius: 20,
    marginLeft: 10,
  },
  pageNumber: {
    color: PRIMARY_GOLD,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  
});

export default BottomNavigationBar;
