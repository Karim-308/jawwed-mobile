// src/screens/moshaf/MoshafScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator , Share } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPageData, setPageNumber } from '../../../redux/actions/pageActions';
import QuranPageParser from '../../../utils/QuranPageParser';
import {collectFullAyahText} from '../../../utils/helpers';
import { stopAudio,playAudioForOneVerse,playAudioForMultipleVerses,resumeAudio,pauseAudio } from '../../../api/services/audio/AudioService';
import { SafeAreaView } from 'react-native-safe-area-context';
import  AyahTooltip  from  './Tooltip/AyahTooltip'
import  postBookmark  from '../../../api/bookmark/PostBookmark';

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
  // pageNumber, loading, data, and error are extracted from the page state slice
  const { pageNumber, loading, data, error } = useSelector((state) => state.page);
  // linesData contains the parsed lines for the current page
  // versesAudio contains the audio URLs for each ayah on the page
  // selectedAyahs stores the selected ayahs for highlighting
  // tooltipData contains the selected ayah text and position for the tooltip   
  const linesData = useSelector((state) => state.page.data[pageNumber]);
  const versesAudio = useSelector((state) => state.page.versesAudio);
  const [selectedAyahs, setSelectedAyahs] = useState({});
  const { width } = useWindowDimensions();
  const containerWidth = useMemo(() => width * 0.9, [width]);
  const [tooltipData, setTooltipData] = useState(null);


  // Fetch page data when the component mounts or the page number changes
  useEffect(() => {
    // Fetch page data from the API when the component mounts or the page number changes 
    // The pageNumber is passed as a dependency to the useEffect hook
    // This ensures that the effect runs whenever the pageNumber changes
    // The data is parsed using the QuranPageParser utility function
    // The parsed data is stored in the page state slice
    dispatch(fetchPageData(pageNumber)); // Fetch page data from the API
    console.log('Fetching data for page:', pageNumber);
  }, [dispatch, pageNumber]);

  /** toggleAyahSelection Function
   * 
   *  This function toggles the selection of an ayah based on the verse key.
   *  @param verseKey represents the unique key for the ayah (e.g., 1:1)
   *  @param ayahText represents the full text of the selected ayah
   *  @param position represents the position of the selected ayah for displaying the tooltip
   *  If the same ayah is selected, it is deselected.
   *  If a different ayah is selected, the previous selection is cleared.
   *  The tooltipData state is updated to show or hide the tooltip based on the selection.
   */ 
  const toggleAyahSelection = useCallback((verseKey, ayahText, position) => {
    setSelectedAyahs((prev) => {
      // If the same ayah is selected, deselect it
      if (prev[verseKey]) {
        setTooltipData(null); // Hide tooltip when deselected
        return {};
      }
      // Otherwise, select the new ayah and deselect any previous ones
      setTooltipData({ verseKey, ayahText, position }); // Show tooltip when selected
      return { [verseKey]: true };
    });
}, []);


/** selectAyahFromWord Function
 *  This function selects the ayah based on the word index and position.
 *  It determines the ayah to which the word belongs and selects that ayah.
 *  If the word is not part of an ayah, it selects the first ayah in the line.
 *  The function is called when a word is long-pressed to select the corresponding ayah.
 * 
 *  The selected ayah text is collected using the collectFullAyahText helper function.
 *  The toggleAyahSelection function is called to handle the selection logic.
 *  The useCallback hook is used to memoize the function and prevent unnecessary re-renders.
 *  The function depends on the toggleAyahSelection and linesData states.
 *  @param line represents the line object containing the text and verse keys
 *  @param wordIndex represents the index of the selected word in the line
 *  @param position represents the position of the selected word for displaying the tooltip
 *  
 */
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
      // selectedAyahText is the full ayah text for the selected ayah 
      // The toggleAyahSelection function is called to handle the selection logic
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


/** onSwipe Function
 * This function handles the swipe gestures to navigate between pages.
 * It updates the page number based on the swipe direction.
 * The function is called when a swipe gesture is detected on the screen.
 * The pageNumber state is updated to navigate to the previous or next page.
 * The setTooltipData function is called to hide the tooltip when swiping.
 * @param direction represents the swipe direction (left or right)
*/
  const onSwipe = useCallback((direction) => {
    if (direction === 'SWIPE_LEFT' && pageNumber > 1) {
      setTooltipData(null); // Hide tooltip when swiping
      dispatch(setPageNumber(pageNumber - 1));
    } else if (direction === 'SWIPE_RIGHT' && pageNumber < 604) {
      setTooltipData(null); // Hide tooltip when swiping
      dispatch(setPageNumber(pageNumber + 1));
    }
  }, [dispatch, pageNumber]);

  /** handleShare Function
   * This function handles sharing the selected ayah text.
   * It uses the Share API to share the selected ayah text with other apps.
   * The function is called when the user selects the share option from the tooltip.
   * The ayah text and key are passed as parameters to the Share API.
   * If no text is selected, an error message is logged.
   * 
   * @param {string} ayahText example: "الحمد لله رب العالمين"
   * @param {string} key example: 1:1 
   * @returns 
   */
  const handleShare = async (ayahText, key) => {
    console.log(`Sharing: ${ayahText} (${key})`);
    
    if (!ayahText) {
      console.log("No text selected to share.");
      return;
    }
  
    try {
      await Share.share({
        message: `${ayahText} (${key})`,
        title: 'Sharing Selected Ayah',
      });
    } catch (error) {
      console.error('Error sharing text:', error);
    }
    setTooltipData(null);
  };
  
  const handlePlay = (key) => {
    playAudioForOneVerse("Alafasy",pageNumber,key);
    console.log(`Playing Ayah: ${key}`);
    setTooltipData(null);
  };
  
  const handleBookmark = async (key) => {
    // Prepare the data for the API request
    const bookmarkData = {
      userId: 2, // Replace with the actual userId or fetch it dynamically
      verseKey: key, // Pass the key as the verseKey
      verse: tooltipData.ayahText, // Assume tooltipData.ayahText contains the text
      page: pageNumber.toString(), // Ensure pageNumber is a string
    };
  
    try {
      // Send the data to the API
      const response = await postBookmark(bookmarkData);
      console.log('Bookmark successfully posted:', response);
    } catch (error) {
      console.error('Error posting bookmark:', error);
    }
  };

  /** renderAyahLines Function
   *  This function renders the ayah lines for the current page.
   *  It handles loading, error, and empty states for the page data.
   *  The function maps over the parsed lines to render the ayah text.
   *  The ayah text is split into words, and the boundaries are identified.
   *  The verse key for each word is determined based on the ayah boundaries.
   *  The isSelected flag is set based on the selected ayahs state.
   *  The displayed word is checked for Arabic numerals and formatted accordingly.
   *  The ayah text is displayed in the Uthmanic font with the selected style.
   *  The long-press event is handled to select the ayah from the word.
   *  The function returns the rendered ayah lines with the tooltip component.
   * 
   */
  const renderAyahLines = useCallback(() => {
    if (loading) {
      // Show loading indicator while fetching data
      // The ActivityIndicator component is displayed in the center of the screen
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EFB975" />
        </View>
      );
    }
  
    if (error) {
      // Show error message and retry button if data fetching fails
      // The error message and retry button are displayed in the center of the screen
      // The retry button dispatches the fetchPageData action when pressed
      // The fetchPageData action fetches the page data from the API
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
    // If no data is found for the current page, display an empty state message
    if (!data[pageNumber] || data[pageNumber].length === 0) {
      console.log('No data found for page:', pageNumber);
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available for this page</Text>
        </View>
      );
    }


   // **Main Rendering Logic: Parse and Render Ayah Lines**
    console.log('Parsed Lines for Page:', linesData);
    console.log("Audio Data " , versesAudio);
  
    return linesData.map((line, lineIndex) => {
      // Split the ayah text into words and identify ayah boundaries
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

            // Check if the word is selected based on the verse key
            // The isSelected flag is set based on the selectedAyahs state
            // The selectedWord style is applied to the selected worي
            const isSelected = verseKeyForWord && selectedAyahs[verseKeyForWord];
            // This line fixed the tajweed symbols issue 
            const displayedWord = /^[٠١٢٣٤٥٦٧٨٩]+$/.test(word) ? '' + word : word + '';

            return (
              <TouchableOpacity
                key={`word-${wIndex}`}
                style={line.isCentered && { marginHorizontal: containerWidth * 0.005 }}
                onLongPress={(e) => {
                  // Select the ayah based on the word index and position
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
    });}, [data, loading, error, containerWidth, selectAyahFromWord, selectedAyahs, pageNumber, dispatch]);
  
  return (
    <SafeAreaView style={styles.MushafVeiwContainer}>
    
    
      <GestureRecognizer onSwipeLeft={() => onSwipe('SWIPE_LEFT')} onSwipeRight={() => onSwipe('SWIPE_RIGHT')} style={{ flex: 1 }}>
        {renderAyahLines()}
        {/* Render the tooltip component when a word is long-pressed*/}
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
    paddingTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    writingDirection: 'rtl',
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