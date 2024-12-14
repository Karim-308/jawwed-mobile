import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser3';
import * as Font from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import { setPageNumber } from '../../../redux/reducers';

const { width, height } = Dimensions.get('window');

const MoshafPage = () => {
  const dispatch = useDispatch();
  const pageNumber = useSelector((state) => state.pageNumber);
  const [ayahContent, setAyahContent] = React.useState('');
  const [fontLoaded, setFontLoaded] = React.useState(false);

  useEffect(() => {
    const loadFontsAndFetchContent = async () => {
      await loadFonts();
      fetchAyahContent(pageNumber);
    };

    loadFontsAndFetchContent();
  }, []);

  useEffect(() => {
    fetchAyahContent(pageNumber);
  }, [pageNumber]);

  const loadFonts = async () => {
    await Font.loadAsync({
      'UthmanicHafs': require('../../../assets/fonts/UthmanicHafs1B Ver13.ttf'),
    });
    setFontLoaded(true);
  };

  const fetchAyahContent = (pageNum) => {
    const lines = QuranPageJsonParser(pageNum);
    if (Array.isArray(lines)) {
      const content = lines.map((line) => line.cleanedText).join('');
      setAyahContent(content);
    } else {
      console.error('QuranPageJsonParser did not return an array:', lines);
    }
  };

  const onSwipe = (direction) => {
    if (direction === 'SWIPE_LEFT' && pageNumber > 1) {
        dispatch(setPageNumber(pageNumber - 1));
    } else if (direction === 'SWIPE_RIGHT' && pageNumber < 5) { // Limit to page 5
        dispatch(setPageNumber(pageNumber + 1));
    }
};

  const renderAyahLines = () => {
    return ayahContent.split('\n').map((line, index) => {
      const trimmedLine = line.trimEnd();
      return (
        <View key={index} style={styles.lineWrapper}>
          {trimmedLine.split(' ').map((word, index) => (
            <Text key={index} style={styles.ayahText}>{word}</Text>
          ))}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureRecognizer
        onSwipeLeft={() => onSwipe('SWIPE_LEFT')}
        onSwipeRight={() => onSwipe('SWIPE_RIGHT')}
        style={styles.textAreaContainer}
      >
        {fontLoaded && renderAyahLines()}
      </GestureRecognizer>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    textAreaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        writingDirection: 'rtl',
        direction: 'rtl',
    },
    ayahText: {
        writingDirection: 'rtl',
        letterSpacing: 10,
        fontSize: 20,
        fontWeight: 'semibold',
        textAlign: "right",
        fontFamily: 'UthmanicHafs',
        color: 'white',
    },
    lineWrapper: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 10,
        paddingVertical: 0,
        width: "97%",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
        marginVertical: 0,
    },
});

export default MoshafPage;
