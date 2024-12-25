// src/screens/moshaf/MoshafScreen.js
import React, { useState, useEffect, useCallback, useMemo , useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPageData, setPageNumber } from '../../../redux/actions/pageActions';
import QuranPageParser from '../../../utils/QuranPageParser';
import {collectFullAyahText} from '../../../utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import  AyahTooltip  from  './Tooltip/AyahTooltip'

// Helper function: Identify ayah boundaries based on Arabic digits.
const findAyahBoundaries = (words) => {
  const boundaries = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (/^[٠١٢٣٤٥٦٧٨٩]+$/.test(w)) {
      boundaries.push(i);
    }
  }
  return boundaries;
};

const MoshafPage = React.memo(() => {
  const dispatch = useDispatch();
  const { pageNumber, loading, data, error } = useSelector((state) => state.page);
  const linesData = useSelector((state) => state.page.data[pageNumber]);
  const versesAudio = useSelector((state) => state.page.versesAudio);
  const [selectedAyahs, setSelectedAyahs] = useState({});
  const selectedWordsRef = useRef([]);
  const { width } = useWindowDimensions();
  const containerWidth = useMemo(() => width * 0.9, [width]);
  const [tooltipData, setTooltipData] = useState(null);


  useEffect(() => {
    dispatch(fetchPageData(pageNumber));  // Only fetch data; parsing is in reducer
    console.log('Fetching data for page:', pageNumber);
  }, [dispatch, pageNumber]);

  const toggleAyahSelection = useCallback((verseKey, ayahText, position) => {
    setSelectedAyahs((prev) => {
      // If the same ayah is selected, deselect it
      if (prev[verseKey]) {
        setTooltipData(null); // Hide tooltip when deselected
        //setSelectedWords((prevWords) => prevWords.filter((item) => item.verseKey !== verseKey));
        selectedWordsRef.current = selectedWordsRef.current.filter(
          (item) => item.verseKey !== verseKey
        );
        return {};
      }
      // Otherwise, select the new ayah and deselect any previous ones
      setTooltipData({ verseKey, ayahText, position }); // Show tooltip when selected
      return { [verseKey]: true };
    });
}, []);



const selectAyahFromWord = useCallback((line, wordIndex, position) => {
    const { verseKeys, text } = line;
    const words = text.split(' ');

    if (verseKeys.length === 0) return;  // Guard clause if no ayahs in the line

    let selectedAyahText = '';

    // Case 1: Single Ayah in the Line
    if (verseKeys.length === 1) {
      const verseKey = verseKeys[0];
      selectedAyahText = collectFullAyahText(linesData, verseKey);
      toggleAyahSelection(verseKey, selectedAyahText, position);
      return;
    }

    // Case 2: Multiple Ayahs in One Line
    const boundaries = findAyahBoundaries(words);

    if (boundaries.length === 0) {
      // No ayah numbers detected – Select the first ayah by default
      selectedAyahText = collectFullAyahText(linesData, verseKeys[0]);
      toggleAyahSelection(verseKeys[0], selectedAyahText, position);
      return;
    }

    // Determine which ayah the word belongs to
    let ayahIndex = 0;
    for (let i = 0; i < boundaries.length; i++) {
      if (wordIndex <= boundaries[i]) {
        ayahIndex = i;
        break;
      }
      // If wordIndex exceeds all boundaries, select the last ayah
      if (i === boundaries.length - 1 && wordIndex > boundaries[i]) {
        ayahIndex = boundaries.length;
      }
    }

    // Boundary Guard – Ensure ayahIndex doesn't exceed verseKeys length
    if (ayahIndex >= verseKeys.length) {
      ayahIndex = verseKeys.length - 1;
    }

    const verseKey = verseKeys[ayahIndex];
    selectedAyahText = collectFullAyahText(linesData, verseKey);

    // Pass the ayah key and collected ayah text to the selection handler
    toggleAyahSelection(verseKey, selectedAyahText, position);
}, [toggleAyahSelection, linesData]);


  const onSwipe = useCallback((direction) => {
    if (direction === 'SWIPE_LEFT' && pageNumber > 1) {
      setTooltipData(null); // Hide tooltip when swiping
      dispatch(setPageNumber(pageNumber - 1));
    } else if (direction === 'SWIPE_RIGHT' && pageNumber < 604) {
      setTooltipData(null); // Hide tooltip when swiping
      dispatch(setPageNumber(pageNumber + 1));
    }
  }, [dispatch, pageNumber]);

  {/*const handleWordSelection = (word, verseKey) => {
    setSelectedWords((prevWords) => [...prevWords, { displayedWord: word, verseKey }]);
  };*/}

  const handleShare = () => {
    const sharedText = selectedWordsRef.current.map((item) => item.displayedWord).join(' ');
    console.log(`Sharing: ${sharedText}`);
  };
  
  const handlePlay = (key) => {
    console.log(`Playing Ayah: ${key}`);
  };
  
  const handleBookmark = (key) => {
    console.log(`Bookmarking Ayah: ${key}`);
  };
  

  // Render Quranic Lines with Parsed Data
  const renderAyahLines = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EFB975" />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>حدث خطأ ما. الرجاء المحاولة مرة أخرى.</Text>
          <TouchableOpacity onPress={() => dispatch(fetchPageData(pageNumber))} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
  
    // **Guard Clause: If no data, show empty state and return early**
    if (!data[pageNumber] || data[pageNumber].length === 0) {
      console.warn('No data found for page:', pageNumber);
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available for this page</Text>
        </View>
      );
    }
  
    // **Only parse if data exists**
    // Parse the page data using the QuranPageParser utility
    // This will return an object with linesData and uniqueVerses
    // We are only interested in the linesData for rendering
    // The uniqueVerses can be used for audio playback
    // The parser will also remove and replace Tajweed symbols
    // and extract unique verse keys with audio URLs
    // This will help in highlighting and playing audio for specific verse
    // versesAudio is accessible from here !!!!!!!! 

    let tempSelectedWords = [];

  
    console.log('Parsed Lines for Page:', linesData);
  
    return linesData.map((line, lineIndex) => {
      const words = line.text.split(' ');
      const boundaries = findAyahBoundaries(words);

      return (
        <View
          key={`line-${lineIndex}`}
          style={[
            styles.lineWrapper,
            { width: containerWidth },
            line.isCentered && { justifyContent: 'center' },
          ]}
        >
          {words.map((word, wIndex) => {
            let verseKeyForWord = null;
            if (line.verseKeys.length === 1) {
              verseKeyForWord = line.verseKeys[0];
            } else if (line.verseKeys.length > 1 && boundaries.length > 0) {
              let ayahIndex = 0;
              for (let i = 0; i < boundaries.length; i++) {
                if (wIndex <= boundaries[i]) {
                  ayahIndex = i;
                  break;
                }
                if (i === boundaries.length - 1 && wIndex > boundaries[i]) {
                  ayahIndex = boundaries.length;
                }
              }
              if (ayahIndex >= line.verseKeys.length) ayahIndex = line.verseKeys.length - 1;
              verseKeyForWord = line.verseKeys[ayahIndex];
            }

            const isSelected = verseKeyForWord && selectedAyahs[verseKeyForWord];            
            const displayedWord = /^[٠١٢٣٤٥٦٧٨٩]+$/.test(word) ? '' + word : word + '';

            // Collect selected words temporarily
            if (isSelected) {
              tempSelectedWords.push({ displayedWord });
              console.log('Selected Words:', tempSelectedWords);
          }
            
            return (
              <TouchableOpacity
                key={`word-${wIndex}`}
                style={line.isCentered && { marginHorizontal: containerWidth * 0.005 }}
                onLongPress={(e) => {
                  selectAyahFromWord(line, wIndex, {
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                  });
                }}
                
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.ayahText,
                    { fontSize: containerWidth * 0.054 },
                    isSelected && styles.selectedWord,
                  ]}
                >
                  {displayedWord}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
      useEffect(() => {
        selectedWordsRef.current = tempSelectedWords;
      });

    });}, [data, loading, error, containerWidth, selectAyahFromWord, selectedAyahs, pageNumber, dispatch]);
  
  return (
    <SafeAreaView style={styles.MushafVeiwContainer}>
    
    
      <GestureRecognizer onSwipeLeft={() => onSwipe('SWIPE_LEFT')} onSwipeRight={() => onSwipe('SWIPE_RIGHT')} style={{ flex: 1 }}>
        {renderAyahLines()}
        {tooltipData && (
          <AyahTooltip
            ayahText={tooltipData.ayahText}
            ayahKey={tooltipData.verseKey}
            onShare={handleShare}
            onPlay={handlePlay}
            onBookmark={handleBookmark}
            style={{
              position: 'absolute',
              top:  tooltipData.position.y - 220,
              left: "30%",
            }}
          />
        )}
      </GestureRecognizer>
    </SafeAreaView>
  );
});

export default MoshafPage;


const styles = StyleSheet.create({
  MushafVeiwContainer: {
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    writingDirection: 'rtl',
    direction: 'rtl',
    padding: 10,
    flex: 1,
  },
  lineWrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  ayahText: {
    fontFamily: 'UthmanicHafs',
    color: 'white',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  selectedWord: {
    color: '#EFB975',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#EFB975',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
