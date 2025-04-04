import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Animated, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import RenderHTML from 'react-native-render-html';
import getTafsir from '../../../../api/tafsir/GetTafsir';

const screenWidth = Dimensions.get('window').width;

const TafsirModal = ({ isVisible, onClose, ayahKey, ayahText, selectedSource, onSourceChange }) => {
  const [tafsir, setTafsir] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textSize, setTextSize] = useState(19);
  
  const translateY = useRef(new Animated.Value(300)).current;

  
  const fetchTafsir = async (verseKey, mofasirID) => {
    setLoading(true);
    setError(null);
    try {
      const tafsirText = await getTafsir(verseKey, mofasirID);
      setTafsir(tafsirText);  // API response contains HTML
    } catch (err) {
      setError('Failed to fetch Tafsir.');
    }
    setLoading(false);
  };

  // Fetch Tafsir when modal opens or source changes
  useEffect(() => {
    if (isVisible && ayahKey) {
      fetchTafsir(ayahKey, Number(selectedSource));
    }
  }, [isVisible, ayahKey, selectedSource]);

  // Slide-up animation
  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}> 
          {/* Notch Indicator */}
          <View style={styles.notch} />

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="#EFB975" />
          </TouchableOpacity>

          {/* Ayah Display */}
          <ScrollView style={styles.ayahContainer}>
            <Text style={[styles.ayahText, { fontSize: 20 , fontFamily:'UthmanicHafs' }]}>{ayahText}</Text>
          </ScrollView>

          {/* Tafsir Source Picker */}
          <Picker
            selectedValue={selectedSource}
            onValueChange={(itemValue) => onSourceChange(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem} 
            mode="dropdown"
          >
            <Picker.Item label="تفسير ابن كثير" value="1" />
            <Picker.Item label="التفسير الميسر" value="2" />
            <Picker.Item label="تفسير الطبري" value="3" />
          </Picker>

          {/* Tafsir Text with HTML Support */}
          <ScrollView style={styles.scrollContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#EFB975" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <RenderHTML
                contentWidth={screenWidth * 0.9} // Ensure responsive rendering
                source={{ html: tafsir }} // Pass Tafsir HTML content
                tagsStyles={{
                  p: { color: '#fff', fontSize: textSize, textAlign: 'right' ,direction:"rtl"  },
                  strong: { fontWeight: 'bold', color: '#EFB975' },
                }}
              />
            )}
          </ScrollView>

          {/* Text Size Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: '80%' }}
              minimumValue={14}
              maximumValue={24}
              step={1}
              value={textSize}
              onValueChange={setTextSize}
              minimumTrackTintColor="#EFB975"
              maximumTrackTintColor="#888"
              thumbTintColor="#EFB975"
            />
            <Text style={styles.sliderLabel}>حجم الخط </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TafsirModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EFB975',
  },
  notch: {
    width: 50,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 12,
  },
  ayahContainer: {
    backgroundColor: 'rgba(239, 185, 117, 0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxHeight: 300,
  },
  ayahText: {
    color: '#fff',
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#333',
    color: '#EFB975',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerItem: {
    backgroundColor: 'red',
    textAlign: 'center', // Works on iOS
    fontSize: 18,
    color: '#EFB975',
  },
  scrollContainer: {
    maxHeight: 250,
    marginBottom: 10,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sliderLabel: {
    color: '#EFB975',
    fontSize: 14,
  },
});
