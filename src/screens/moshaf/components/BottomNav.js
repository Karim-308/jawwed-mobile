import React, { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlay} from '../../../redux/reducers/audioReducer';
import { hideNav,showNav } from '../../../redux/reducers/navigationReducer';
import IsPlay from './isPlayNavBar';
import { PRIMARY_GOLD, DARK_GREY } from '../../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { stopAudio,playAudioForOneVerse,playAudioForMultipleVerses,resumeAudio,pauseAudio } from '../../../api/services/audio/AudioService';



/**
 * Main bottom navigation bar component that displays a set of icons 
 * and a play/pause toggle. It conditionally renders either this 
 * navigation bar or the IsPlay component based on the isPlaying state.
 */

const BottomNavigationBar = () => {
  const dispatch = useDispatch();
  // Selectors
  const isPlaying = useSelector((state) => state.audio.isPlaying); // From audio reducer
  const isPaused = useSelector((state) => state.audio.isPaused); // From audio reducer
  const isVisible = useSelector((state) => state.navigation.isVisible); // From navigation reducer
  const pageNumber = useSelector((state) => state.page.pageNumber); // From page reducer
  const navigation = useNavigation();


  const arabicPageNumber = useMemo(() => Intl.NumberFormat('ar-EG').format(pageNumber), [pageNumber]);
  // Hides the navigation bar
  const handleHide = () => {
    dispatch(hideNav());
  };

  // Shows the navigation bar
  const handleShow = () => {
    dispatch(showNav());
    console.log(isVisible);
  };

  const goToBookmark = () => {
    navigation.navigate('BookmarkPage');
  }
    

  return (
    <>
    {isPlaying || isPaused ? (
      <IsPlay />
    ) : isVisible ? ( // Show navigation bar if visible
      <View style={styles.container}>
        {/* Gold Line Block */}
        <View style={styles.goldLineBlock}>
          <View style={styles.goldLine} />
        </View>
        <View style={styles.goldLineBackground}></View>

        {/* Left Icons */}
        <View style={[styles.iconGroup, styles.leftGroup]}>
          <TouchableOpacity style={styles.icon}>
            <Feather name="share-2" size={24} color={PRIMARY_GOLD} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={goToBookmark}>
            <MaterialIcons name="bookmark-border" size={24} color={PRIMARY_GOLD} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome5 name="eye-slash" size={20} color={PRIMARY_GOLD} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {dispatch(togglePlay()); pauseAudio();}}
          >
            <MaterialIcons name="multitrack-audio" size={24} color={PRIMARY_GOLD} />
          </TouchableOpacity>

          <View style={styles.playButton}>
            <TouchableOpacity
              onPress={() => {
                playAudioForMultipleVerses('Alafasy', pageNumber);
              }}
            >
              <Ionicons name={isPlaying ? "pause-outline" : "play-outline"} size={40} color={PRIMARY_GOLD} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Icon */}
        <View style={styles.centerIcon}>
          <View style={styles.centerShape}>
            <Text style={styles.centerText}>{arabicPageNumber}</Text>
          </View>
        </View>

        {/* Right Icon */}
        <TouchableOpacity style={styles.icon} onPress={handleHide}>
          <MaterialIcons name="keyboard-arrow-down" size={24} color={PRIMARY_GOLD} />
        </TouchableOpacity>
      </View>
    ) : (

      // Hidden state of the navigation bar
      <View style={styles.hiddenContainer}>
        <View style={styles.pageNumberContainer}>
          <View style={styles.centerShape}>
            <Text style={styles.centerText}>{arabicPageNumber}</Text>
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
    height: 60,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    width: '100%',
  },
  pageNumberContainer: {
    marginLeft: "47%",
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
  upArrow: {
    padding: 5,
  },
  
});

export default BottomNavigationBar;
