import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser';

// Identify ayah boundaries based on Arabic digits.
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

const MoshafScreen = React.memo(() => {
    const [lines, setLines] = useState([]);
    const [selectedAyahs, setSelectedAyahs] = useState({});

    const { width } = useWindowDimensions();
    const containerWidth = useMemo(() => width * 0.9, [width]);

    useEffect(() => {
        const parsedLines = QuranPageJsonParser();
        if (Array.isArray(parsedLines)) {
            setLines(parsedLines);
        } else {
            console.error('QuranPageJsonParser did not return an array:', parsedLines);
        }
    }, []);

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
                        const displayedWord = /^[٠١٢٣٤٥٦٧٨٩]+$/.test(word) ? (' ' + word) : (word + ' ');

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

    return (
        <View style={styles.MushafVeiwContainer}>
            {renderAyahLines()}
        </View>
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
