import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated,TouchableOpacity, ActivityIndicator, Dimensions, PanResponder, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import RenderHTML from 'react-native-render-html';
import getTafsir from '../../../../api/tafsir/GetTafsir';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TafsirBottomSheet = ({ isVisible, onClose, ayahKey, ayahText, selectedSource, onSourceChange }) => {
  const [tafsir, setTafsir] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textSize, setTextSize] = useState(19);
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const lastGestureY = useRef(0);
  const sheetHeight = useRef(screenHeight * 0.6); // Default height
  const maxSheetHeight = screenHeight * 0.9;
  const minSheetHeight = screenHeight * 0.3;
  const dismissThreshold = screenHeight * 0.15;
  
  // Scroll handling
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrollEnabled = useRef(true);
  
  const fetchTafsir = async (verseKey, mofasirID) => {
    setLoading(true);
    setError(null);
    try {
      const tafsirText = await getTafsir(verseKey, mofasirID);
      setTafsir(tafsirText);
    } catch (err) {
      setError('Failed to fetch Tafsir.');
    }
    setLoading(false);
  };

  // Configure pan responder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Allow panning if we're at the top of the scroll view and dragging down
        // or if we're dragging the header area
        const isScrollAtTop = scrollY._value === 0;
        const isDraggingDown = gestureState.dy > 0;
        
        return (isScrollAtTop && isDraggingDown) || (gestureState.y0 < 80);
      },
      onPanResponderGrant: () => {
        lastGestureY.current = sheetHeight.current;
        isScrollEnabled.current = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newHeight = lastGestureY.current - gestureState.dy;
        
        // Constrain the height between min and max
        const constrainedHeight = Math.max(
          minSheetHeight,
          Math.min(maxSheetHeight, newHeight)
        );
        
        // Update the sheet position
        translateY.setValue(screenHeight - constrainedHeight);
        sheetHeight.current = constrainedHeight;
      },
      onPanResponderRelease: (evt, gestureState) => {
        isScrollEnabled.current = true;
        
        // If dragged down past the dismiss threshold, close the sheet
        if (gestureState.dy > dismissThreshold && gestureState.vy > 0) {
          closeSheet();
          return;
        }
        
        // Snap to preset heights
        let snapToHeight;
        if (gestureState.vy > 0.5) {
          // Swiping down with velocity
          snapToHeight = minSheetHeight;
        } else if (gestureState.vy < -0.5) {
          // Swiping up with velocity
          snapToHeight = maxSheetHeight;
        } else if (sheetHeight.current > (minSheetHeight + maxSheetHeight) / 2) {
          // Static position - closer to max
          snapToHeight = maxSheetHeight;
        } else {
          // Static position - closer to min
          snapToHeight = minSheetHeight;
        }
        
        // Animate to the snap height
        Animated.spring(translateY, {
          toValue: screenHeight - snapToHeight,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
        
        sheetHeight.current = snapToHeight;
      },
    })
  ).current;

  // Fetch Tafsir when sheet opens or source changes
  useEffect(() => {
    if (isVisible && ayahKey) {
      fetchTafsir(ayahKey, Number(selectedSource));
    }
  }, [isVisible, ayahKey, selectedSource]);

  // Control sheet visibility
  useEffect(() => {
    if (isVisible) {
      sheetHeight.current = screenHeight * 0.6; // Reset to default height
      Animated.spring(translateY, {
        toValue: screenHeight - sheetHeight.current,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(screenHeight);
    }
  }, [isVisible]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] }
        ]}
      >
        {/* Draggable header area */}
        <View {...panResponder.panHandlers} style={styles.headerArea}>
          <View style={styles.notch} />
          <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="#EFB975" />
          </TouchableOpacity>
        </View>

        {/* Ayah Display */}
        <ScrollView style={styles.ayahContainer}>
          <Text style={[styles.ayahText, { fontSize: 20, fontFamily: 'UthmanicHafs' }]}>
            {ayahText}
          </Text>
        </ScrollView>

        {/* Tafsir Source Selector */}
        <Picker
          selectedValue={selectedSource}
          onValueChange={onSourceChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode="dropdown"
        >
          <Picker.Item label="تفسير ابن كثير" value="1" />
          <Picker.Item label="التفسير الميسر" value="2" />
          <Picker.Item label="تفسير الطبري" value="3" />
        </Picker>

        {/* Tafsir Content Area - grows with sheet height */}
        <Animated.ScrollView
          ref={scrollViewRef}
          style={[styles.scrollContainer, { 
            maxHeight: Animated.subtract(sheetHeight.current, 220) 
          }]}
          scrollEnabled={isScrollEnabled.current}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#EFB975" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <RenderHTML
              contentWidth={screenWidth * 0.9}
              source={{ html: tafsir }}
              tagsStyles={{
                p: { color: '#fff', fontSize: textSize, textAlign: 'right', direction: "rtl" },
                strong: { fontWeight: 'bold', color: '#EFB975' },
              }}
            />
          )}
        </Animated.ScrollView>

        {/* Text Size Controls */}
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
          <Text style={styles.sliderLabel}>حجم الخط</Text>
        </View>
      </Animated.View>
      
      {/* Semi-transparent background overlay */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={closeSheet} 
      />
    </View>
  );
};

export default TafsirBottomSheet;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    marginBottom:100
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EFB975',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerArea: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notch: {
    width: 50,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 10,
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
    maxHeight: 100,
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
    textAlign: 'center',
    fontSize: 18,
    color: '#EFB975',
  },
  scrollContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 10,
  },
  errorText: {
    color: '#ff5c5c',
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  loader: {
    padding: 20,
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