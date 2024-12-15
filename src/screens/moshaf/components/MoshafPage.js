import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser';
import { useSelector, useDispatch } from 'react-redux';
import { setPageNumber } from '../../../redux/reducers';

// Identify ayah boundaries based on Arabic digits.
const findAyahBoundaries = (words) => {
    const boundaries = [];
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        // Check if word is entirely Arabic digits ٠١٢٣٤٥٦٧٨٩
        if (/^[٠١٢٣٤٥٦٧٨٩]+$/.test(w)) {
            boundaries.push(i);
        }
    }
    return boundaries;
};

const MoshafScreen = React.memo(() => {
    const [lines, setLines] = useState([]);
    const [selectedAyahs, setSelectedAyahs] = useState({});
    const dispatch = useDispatch();
    const pageNumber = useSelector((state) => state.pageNumber);
    const { width } = useWindowDimensions();
    const containerWidth = useMemo(() => width * 0.9, [width]);

    useEffect(() => {
        // Load lines from parser whenever pageNumber changes
        const parsedLines = QuranPageJsonParser(pageNumber);
        if (Array.isArray(parsedLines)) {
            setLines(parsedLines);
        } else {
            console.error('QuranPageJsonParser did not return an array:', parsedLines);
        }
    }, [pageNumber]);

    const toggleAyahSelection = useCallback((verseKey) => {
        setSelectedAyahs((prev) => {
            const updated = { ...prev };
            if (updated[verseKey]) {
                delete updated[verseKey];
            } else {
                updated[verseKey] = true;
            }
            return updated;
        });
    }, []);

    const selectAyahFromWord = useCallback((line, wordIndex) => {
        const { verseKeys, text } = line;
        const words = text.split(' ');

        if (verseKeys.length === 0) return;

        if (verseKeys.length === 1) {
            // Entire line = one ayah
            const verseKey = verseKeys[0];
            toggleAyahSelection(verseKey);
            return;
        }

        const boundaries = findAyahBoundaries(words);
        if (boundaries.length === 0) {
            // fallback if no boundaries found
            toggleAyahSelection(verseKeys[0]);
            return;
        }

        let ayahIndex = 0;
        for (let i = 0; i < boundaries.length; i++) {
            if (wordIndex <= boundaries[i]) {
                ayahIndex = i;
                break;
            }
            if (i === boundaries.length - 1 && wordIndex > boundaries[i]) {
                ayahIndex = boundaries.length;
            }
        }

        if (ayahIndex >= verseKeys.length) {
            ayahIndex = verseKeys.length - 1;
        }

        toggleAyahSelection(verseKeys[ayahIndex]);

    }, [toggleAyahSelection]);

    const renderAyahLines = useCallback(() => {
        return lines.map((line, lineIndex) => {
            const words = line.text.split(' ');
            const boundaries = findAyahBoundaries(words);

            return (
                <View
                    key={`line-${lineIndex}`}
                    style={[
                        styles.lineWrapper,
                        { width: containerWidth },
                        line.isCentered && { justifyContent: "center" }
                    ]}
                >
                    {words.map((word, wIndex) => {
                        // Determine verseKeyForWord
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
                        } else if (line.verseKeys.length > 0) {
                            verseKeyForWord = line.verseKeys[0];
                        }

                        const isSelected = verseKeyForWord && selectedAyahs[verseKeyForWord];

                        // Determine spacing:
                        const displayedWord = /^[٠١٢٣٤٥٦٧٨٩]+$/.test(word) ? ('' + word) : (word + '');

                        return (
                            <TouchableOpacity
                                key={`word-${wIndex}`}
                                style={line.isCentered && { marginHorizontal: containerWidth * 0.005 }}
                                onLongPress={() => selectAyahFromWord(line, wIndex)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.ayahText,
                                    { fontSize: containerWidth * 0.058 },
                                    isSelected && styles.selectedWord
                                ]}>
                                    {displayedWord}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        });
    }, [lines, selectedAyahs, containerWidth, selectAyahFromWord]);

    const onSwipe = (direction) => {
        if (direction === 'SWIPE_LEFT' && pageNumber > 1) {
            dispatch(setPageNumber(pageNumber - 1));
        } else if (direction === 'SWIPE_RIGHT' && pageNumber < 604) { 
            // Assuming the Quran has 604 pages (adjust if needed)
            dispatch(setPageNumber(pageNumber + 1));
        }
    };

    return (
        <SafeAreaView style={styles.MushafVeiwContainer}>
            <GestureRecognizer
                onSwipeLeft={() => onSwipe('SWIPE_LEFT')}
                onSwipeRight={() => onSwipe('SWIPE_RIGHT')}
                style={{ flex: 1 }}
            >
                {renderAyahLines()}
            </GestureRecognizer>
        </SafeAreaView>
    );
});

export default MoshafScreen;

const styles = StyleSheet.create({
    MushafVeiwContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        writingDirection: 'rtl',
        direction: 'rtl',
        padding: 11,
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
        textAlign: "center",
        writingDirection: 'rtl',
    },
    selectedWord: {
        color: '#EFB975',
    },
});
