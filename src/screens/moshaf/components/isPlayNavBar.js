import React, { useMemo, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { hideNav, showNav } from '../../../redux/reducers/navigationReducer';
import { PRIMARY_GOLD, DARK_GREY } from '../../../constants/colors';
import { pauseAudio, playAudioForMultipleVerses, stopAudio, resumeAudio } from '../../../api/services/audio/AudioService';

const IsPlay = () => {
  const dispatch = useDispatch();

  const isPlaying = useSelector((state) => state.audio.isPlaying); // From audio reducer
  const isPaused = useSelector((state) => state.audio.isPaused); // From audio reducer
  const pageNumber = useSelector((state) => state.page.pageNumber); // From page reducer

  const lastPlayedPage = useRef(pageNumber); // Keep track of the last played page

  const arabicPageNumber = useMemo(() => Intl.NumberFormat('ar-EG').format(pageNumber), [pageNumber]);

  const handlePlayPause = () => {
    // Check if the page number has changed
    if (pageNumber !== lastPlayedPage.current) {
      stopAudio(); // Stop the current audio
      playAudioForMultipleVerses('Alafasy', pageNumber); // Restart audio for the new page
      lastPlayedPage.current = pageNumber; // Update the last played page
      return;
    }

    // Handle play/pause logic
    if (isPlaying && !isPaused) {
      pauseAudio(); // Pause the audio
    } else if ((!isPlaying && isPaused) || (isPlaying && isPaused)) {
      resumeAudio(); // Resume the audio
    } else {
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.goldLineBlock}>
        <View style={styles.goldLine} />
      </View>

      <View style={styles.goldLineBackground}></View>

      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.speakerButton}>
          <MaterialIcons name="volume-up" size={18} color={PRIMARY_GOLD} />
          <Text style={styles.speakerText}>مشاري العفاسي</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerIcon}>
        <View style={styles.centerShape}>
          <Text style={styles.centerText}>{arabicPageNumber}</Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            stopAudio();
            playAudioForMultipleVerses('Alafasy', pageNumber);
          }}
        >
          <Ionicons name="repeat-outline" size={24} color={PRIMARY_GOLD} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => dispatch(hideNav())}>
          <MaterialIcons name="close" size={24} color={PRIMARY_GOLD} onPress={stopAudio}/>
        </TouchableOpacity>

        <View style={styles.playButton}>
          <TouchableOpacity onPress={handlePlayPause}>
            {isPlaying && !isPaused ? (
              <Ionicons name="pause-outline" size={40} color={PRIMARY_GOLD} />
            ) : (
              <Ionicons name="play-outline" size={40} color={PRIMARY_GOLD} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[styles.icon, styles.upArrow]} onPress={() => dispatch(showNav())}>
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
