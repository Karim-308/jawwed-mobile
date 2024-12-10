import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

// Helper function: Identify ayah boundaries in a line based on Arabic digits
// Returns an array of indices indicating where each ayah ends.
const findAyahBoundaries = (words) => {
    // Arabic digits: ٠١٢٣٤٥٦٧٨٩
    // We'll look for standalone Arabic digits that mark ayah boundaries
    // Typically ayah numbers appear as isolated digits. We assume each ayah number is a single or double digit word.
    const boundaries = [];
    words.forEach((w, i) => {
        // Check if w is composed solely of Arabic digits (ayah number markers)
        if (/^[٠١٢٣٤٥٦٧٨٩]+$/.test(w)) {
            boundaries.push(i);
        }
    });
    return boundaries;
};

const MoshafPage = () => {
    const [lines, setLines] = useState([]);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedAyahs, setSelectedAyahs] = useState({});

    useEffect(() => {
        const loadData = async () => {
            await loadFonts();
            fetchLinesContent();
        };
        loadData();
    }, []);

    const loadFonts = async () => {
        await Font.loadAsync({
            'UthmanicHafs': require('../../../assets/fonts/UthmanicHafs1B Ver13.ttf'),
        });
        setFontLoaded(true);
    };

    const fetchLinesContent = () => {
        const parsedLines = QuranPageJsonParser();
        if (Array.isArray(parsedLines)) {
            setLines(parsedLines);
        } else {
            console.error('QuranPageJsonParser did not return an array:', parsedLines);
        }
    };

    const selectAyahFromWord = useCallback((line, wordIndex) => {
        const { verseKeys, text } = line;
        const words = text.split(' ');

        if (verseKeys.length === 0) {
            // No ayah keys found, do nothing
            return;
        }

        if (verseKeys.length === 1) {
            // Entire line is one ayah
            const verseKey = verseKeys[0];
            toggleAyahSelection(verseKey);
            return;
        }

        // Multiple ayahs in this line.
        // We find the ayah boundaries by scanning for Arabic digit words.
        const boundaries = findAyahBoundaries(words);

        // If no boundaries found, treat entire line as one ayah if verseKeys is misaligned.
        if (boundaries.length === 0) {
            // fallback
            toggleAyahSelection(verseKeys[0]);
            return;
        }

        // The boundaries array marks the indices of ayah number words. 
        // For example, if boundaries = [5, 10], it means:
        // - From start(0) to 5(inclusive) is ayah 1
        // - From 6 to 10(inclusive) is ayah 2
        // - From 11 to end is ayah 3 (if verseKeys.length > 2)

        // We must find which range wordIndex falls into.
        // Let's define start = 0 initially.
        // For each boundary, that defines the end of an ayah.
        let ayahIndex = 0;
        let start = 0;
        for (let i = 0; i < boundaries.length; i++) {
            const end = boundaries[i];
            if (wordIndex <= end) {
                ayahIndex = i; 
                break;
            }
            start = end + 1;
            // If we haven't broken out, it means wordIndex is beyond the current boundary.
            // Move to next ayah range.
            // If after last boundary, word belongs to last ayah
            if (i === boundaries.length - 1 && wordIndex > end) {
                ayahIndex = boundaries.length; 
            }
        }

        // ayahIndex corresponds to the ayahNumber in verseKeys (0-based)
        if (ayahIndex >= verseKeys.length) {
            // If we somehow got an ayahIndex out of range, fallback to last ayah
            ayahIndex = verseKeys.length - 1;
        }

        const verseKey = verseKeys[ayahIndex];
        toggleAyahSelection(verseKey);

    }, [lines, selectedAyahs]);

    const toggleAyahSelection = (verseKey) => {
        setSelectedAyahs((prev) => {
            const updated = { ...prev };
            if (updated[verseKey]) {
                delete updated[verseKey];
            } else {
                updated[verseKey] = true;
            }

            // Optional: log info
            console.log(`Toggled Ayah: ${verseKey}`);
            console.log('Selected Ayahs:', Object.keys(updated));
            return updated;
        });
    };

    const renderAyahLines = () => {
        return lines.map((line, lineIndex) => {
            const words = line.text.split(' ');
            const boundaries = findAyahBoundaries(words);

            return (
            <View key={`line-${lineIndex}`} style={[styles.lineWrapper , line.isCentered && { justifyContent: "center" } ]}>
                    {words.map((word, wIndex) => {
                        // Determine if selected:
                        // We need to know which ayah this word belongs to.
                        // Let's reuse the logic in a simplified manner:
                        let verseKeyForWord = null;
                        if (line.verseKeys.length === 1) {
                            verseKeyForWord = line.verseKeys[0];
                        } else if (line.verseKeys.length > 1 && boundaries.length > 0) {
                            // Similar logic as in selectAyahFromWord but simpler:
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
                            // If no boundaries, assume first verseKey
                            verseKeyForWord = line.verseKeys[0];
                        }

                        const isSelected = verseKeyForWord && selectedAyahs[verseKeyForWord];

                        return (
                            <TouchableOpacity
                                key={`word-${wIndex}`}
                                style={line.isCentered && { marginHorizontal: 2 }}
                                onLongPress={() => selectAyahFromWord(line, wIndex)
                                }
                            >
                                <Text style={[styles.ayahText, isSelected && styles.selectedWord]}>
                                    {word}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        });
    };

    return (
        <View style={styles.MushafVeiwContainer}>
            {fontLoaded && renderAyahLines()}
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
    lineWrapper: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.9,
        marginBottom: 10,
    },
    ayahText: {
        fontFamily: 'UthmanicHafs',
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    selectedWord: {
        color: '#EFB975',
    },
});
