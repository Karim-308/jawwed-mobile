import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser2';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const MoshafPage = () => {
    const [segments, setSegments] = useState([]);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedAyahs, setSelectedAyahs] = useState({}); 

    useEffect(() => {
        const loadFontsAndFetchContent = async () => {
            await loadFonts();
            fetchAyahContent();
        };
        loadFontsAndFetchContent();
    }, []);

    const loadFonts = async () => {
        await Font.loadAsync({
            'UthmanicHafs': require('../../../assets/fonts/UthmanicHafs1B Ver13.ttf'),
        });
        setFontLoaded(true);
    };

    const fetchAyahContent = () => {
        const parsedSegments = QuranPageJsonParser();
        if (Array.isArray(parsedSegments)) {
            setSegments(parsedSegments);
        } else {
            console.error('QuranPageJsonParser did not return an array:', parsedSegments);
        }
    };

    const handleWordLongPress = (verseKey) => {
        setSelectedAyahs((prev) => {
            const updated = { ...prev };
            if (updated[verseKey]) {
                delete updated[verseKey];
            } else {
                updated[verseKey] = true;
            }

            // Find all segments with the same verseKey and log full text
            const ayahSegments = segments.filter(seg => seg.verseKey === verseKey);
            const ayahFullText = ayahSegments.map(seg => seg.text).join(' ');

            console.log(`Selected Ayah: ${verseKey}`);
            console.log(`Ayah Text: ${ayahFullText}`);
            console.log('Selected Ayahs:', Object.keys(updated));

            return updated;
        });
    };

    // Group segments by lineID
    const groupSegmentsByLine = () => {
        const lines = {};
        segments.forEach((seg) => {
            if (!lines[seg.lineID]) {
                lines[seg.lineID] = [];
            }
            lines[seg.lineID].push(seg);
        });
        return Object.values(lines);
    };

    const renderLine = (lineSegments, lineIndex) => {
        // Flatten all segments in this line into individual words
        // Each word keeps track of verseKey, ayahNumber, etc.
        const wordsInLine = [];
        lineSegments.forEach((segment) => {
            const words = segment.text.split(' ');
            words.forEach((w) => {
                wordsInLine.push({
                    word: w,
                    verseKey: segment.verseKey,
                    ayahNumber: segment.ayahNumber,
                    segmentID: segment.segmentID,
                });
            });
        });

        // Now wordsInLine is an array of {word, verseKey, ...}
        // We can now apply justifyContent:'space-between' to the entire line.
        // To do so, we need to know the width of the line. We'll assume a fixed width.
        // The spacing will be handled by letting 'space-between' distribute words evenly.

        return (
            <View key={`line-${lineIndex}`} style={styles.lineContainer}>
                {wordsInLine.map((wObj, wIndex) => {
                    const isSelected = !!selectedAyahs[wObj.verseKey];
                    return (
                        <TouchableOpacity
                            key={`line-${lineIndex}-word-${wIndex}`}
                            onLongPress={() => handleWordLongPress(wObj.verseKey)}
                        >
                            <Text style={[styles.wordText, isSelected && styles.selectedWord]}>{wObj.word}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.MushafVeiwContainer}>
            {fontLoaded && groupSegmentsByLine().map((lineSegments, index) => renderLine(lineSegments, index))}
        </View>
    );

};

export default MoshafPage;

const styles = StyleSheet.create({
    MushafVeiwContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'black',
        writingDirection: 'rtl',
        direction: 'rtl',
        padding: 10,
    },
    lineContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.9,
        marginBottom: 10,
    },
    selectedWord: {
        //borderColor: '#EFB975',
        //borderWidth: 1,
        //borderRadius: 3,
        color: '#EFB975',
    },
    wordText: {
        fontFamily: 'UthmanicHafs',
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
