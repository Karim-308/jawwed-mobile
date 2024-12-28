import React, { useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { hideNav, showNav } from '../../../redux/reducers/navigationReducer';
import { PRIMARY_GOLD, DARK_GREY } from '../../../constants/colors';
import { pauseAudio, playAudioForMultipleVerses, stopAudio, resumeAudio } from '../../../api/services/audio/AudioService';

const IsPlay = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedReciter, setSelectedReciter] = useState('Alafasy'); // Selected reciter

  const reciters = ['Sudais', 'Shatri', 'Rifai', 'Minshawi', 'Alafasy', 'AbdulBaset'];

  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const isPaused = useSelector((state) => state.audio.isPaused);
  const pageNumber = useSelector((state) => state.page.pageNumber);

  const lastPlayedPage = useRef(pageNumber);

  const arabicPageNumber = useMemo(() => Intl.NumberFormat('ar-EG').format(pageNumber), [pageNumber]);

  const handlePlayPause = () => {
    if (pageNumber !== lastPlayedPage.current) {
      stopAudio();
      playAudioForMultipleVerses(selectedReciter, pageNumber);
      lastPlayedPage.current = pageNumber;
      return;
    }

    if (isPlaying && !isPaused) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };

  const handleReciterSelect = (reciter) => {
    setSelectedReciter(reciter);
    stopAudio();
    playAudioForMultipleVerses(reciter, pageNumber);
    lastPlayedPage.current = pageNumber;
    setModalVisible(false);
  };

  const handleRestartAudio = () => {
    stopAudio();
    playAudioForMultipleVerses(selectedReciter, pageNumber);
    lastPlayedPage.current = pageNumber;
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Reciter</Text>
            <FlatList
              data={reciters}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleReciterSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.goldLineBlock}>
        <View style={styles.goldLine} />
      </View>

      <View style={styles.leftGroup}>
        <TouchableOpacity
          style={styles.speakerButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="volume-up" size={18} color={PRIMARY_GOLD} />
          <Text style={styles.speakerText}>{selectedReciter}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerIcon}>
        <View style={styles.centerShape}>
          <Text style={styles.centerText}>{arabicPageNumber}</Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.icon} onPress={handleRestartAudio}>
          <Ionicons name="repeat-outline" size={24} color={PRIMARY_GOLD} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => dispatch(hideNav())}>
          <MaterialIcons name="close" size={24} color={PRIMARY_GOLD} />
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
    minWidth: 130,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default IsPlay;
