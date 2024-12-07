import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser1';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const MoshafPage = () => {
    const [ayahSegments, setAyahSegments] = useState([]); // All parsed segments
    const [fontLoaded, setFontLoaded] = useState(false); // Font loading state
    const [selectedAyahs, setSelectedAyahs] = useState({}); // Tracks selected Ayahs by ayahNumber

    useEffect(() => {
        const loadFontsAndFetchContent = async () => {
            await loadFonts();
            fetchAyahContent(); // Fetch the Ayah content after fonts are loaded
        };

        loadFontsAndFetchContent();
    }, []);

    const loadFonts = async () => {
        await Font.loadAsync({
            'UthmanicHafs': require('../../../assets/fonts/UthmanicHafs1B Ver13.ttf'),
        });
        setFontLoaded(true); // Update state once the font is loaded
    };

    const fetchAyahContent = () => {
        const segments = QuranPageJsonParser(); // Get the content from the parser
        if (Array.isArray(segments)) {
            setAyahSegments(segments);
        } else {
            console.error('QuranPageJsonParser did not return an array:', segments);
        }
    };

    // Handle long press to select an Ayah
    const handleAyahLongPress = (ayahNumber) => {
        setSelectedAyahs((prevSelectedAyahs) => {
            const updatedSelection = { ...prevSelectedAyahs };
            if (updatedSelection[ayahNumber]) {
                delete updatedSelection[ayahNumber]; // Deselect the Ayah if already selected
            } else {
                updatedSelection[ayahNumber] = true; // Select the Ayah
            }
            return updatedSelection;
        });
    };

    // Render all Ayah segments
    const renderAyahSegments = () => {
        return ayahSegments.map((segment, index) => {
            const isSelected = selectedAyahs[segment.ayahNumber]; // Check if the Ayah is selected
            return (
                <TouchableOpacity
                    key={segment.segmentID}
                    onLongPress={() => handleAyahLongPress(segment.ayahNumber)} // Trigger selection for the Ayah
                    style={[styles.segmentWrapper, isSelected && styles.selectedSegment]} // Highlight if selected
                >
                    <Text style={[styles.ayahText, { color: 'white' }]}>{segment.text}</Text>
                </TouchableOpacity>
            );
        });
    };

    return (
        <View style={styles.MushafVeiwContainer}>
            {fontLoaded && renderAyahSegments()}
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
        height: height,
    },
    ayahText: {
        writingDirection: 'rtl',
        letterSpacing: 10,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'right',
        fontFamily: 'UthmanicHafs',
    },
    segmentWrapper: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 5,
        paddingVertical: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectedSegment: {
        borderColor: '#EFB975',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#1F1F1F', // Subtle background for selected Ayah
    },
});
