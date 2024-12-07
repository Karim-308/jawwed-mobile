import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser2';
import * as Font from 'expo-font';
import { ScrollView } from 'react-native-web';

const { width, height } = Dimensions.get('window');

const MoshafPage = () => {
    const [segments, setSegments] = useState([]);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedAyahs, setSelectedAyahs] = useState({}); 
    // selectedAyahs will map verseKey -> boolean (selected or not)

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
            console.log('QuranPageJsonParser returned segments:', parsedSegments);
        } else {
            console.error('QuranPageJsonParser did not return an array:', parsedSegments);
        }
    };

    const handleSegmentLongPress = (verseKey) => {
        setSelectedAyahs((prev) => {
            const updated = { ...prev };
            if (updated[verseKey]) {
                delete updated[verseKey];
            } else {
                updated[verseKey] = true;
            }
    
            // After updating selection, log the selected ayah details
            // Find all segments with the same verseKey and join their text
            const ayahSegments = segments.filter(seg => seg.verseKey === verseKey);
            const ayahFullText = ayahSegments.map(seg => seg.text).join(' ');
    
            console.log(`Selected Ayah: ${verseKey}`);
            console.log(`Ayah Text: ${ayahFullText}`);
            console.log('Selected Ayahs:', Object.keys(updated));
    
            return updated;
        });
    };
    

    // Group segments by lineID so we can display them line by line
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

    const renderLines = () => {
        const lines = groupSegmentsByLine();
        return lines.map((lineSegments, lineIndex) => {
            return (
                <View key={`line-${lineIndex}`} style={styles.lineWrapper}>
                    {lineSegments.map((segment) => {
                        const words = segment.text.split(' ');
                        const isSelected = !!selectedAyahs[segment.verseKey];
                        return (
                            <TouchableOpacity
                                key={segment.segmentID}
                                onLongPress={() => handleSegmentLongPress(segment.verseKey)}
                                style={[styles.segmentContainer, isSelected && styles.selectedSegment]}
                            >
                                <View style={styles.wordsContainer}>
                                    {words.map((word, wIndex) => (
                                        <Text key={`${segment.segmentID}-word-${wIndex}`} style={styles.wordText}>
                                            {word}
                                        </Text>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        });
    };

    return (
        <View style={styles.MushafVeiwContainer}>
            {fontLoaded && renderLines()}
        </View>
    );
};

export default MoshafPage;

const styles = StyleSheet.create({
    MushafVeiwContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        writingDirection: 'rtl',
        direction: 'rtl',
        padding: 10,
    },
    lineWrapper: {
        flexDirection: 'row-reverse',   // line displayed right-to-left
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.9,
        marginBottom: 0,
        padding: 5,
        flexWrap: 'wrap', // allows wrapping if line too long
        //borderBottomWidth: 1,
        //borderTopWidth: 1,
        borderBottomColor: '#EFB975',
        borderTopColor: '#EFB975',
    },
    segmentContainer: {
        // Each segment is its own container
        marginHorizontal:0,
        // We don't set a fixed width. If you want consistent spacing:
        // You could try a fixed width or a minWidth.
    },
    selectedSegment: {
        borderColor: '#EFB975',
        borderWidth: 2,
        borderRadius: 4,
        backgroundColor: '#1F1F1F',
    },
    wordsContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        // If you want more controlled spacing, you could set a fixed width here.
        // For example:
        //width: width * 0.3, // for demonstration, if needed
    },
    wordText: {
        fontFamily: 'UthmanicHafs',
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'right',
        // letterSpacing can be adjusted if desired:
        letterSpacing: 1,
        writingDirection: 'rtl',
        marginHorizontal: 2, // slight horizontal margin
    },
});
