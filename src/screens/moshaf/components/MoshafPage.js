import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import QuranPageJsonParser from '../../../utils/QuranPageJsonParser';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const MoshafPage = () => {
    const [ayahContent, setAyahContent] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);

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
        const lines = QuranPageJsonParser(); // Get the content
        if (Array.isArray(lines)) {
            setAyahContent(lines.join('')); // Join all lines into a single string with newlines
        } else {
            console.error('QuranPageJsonParser did not return an array:', lines);
        }
    };

    const renderAyahLines = () => {
        
        console.log(ayahContent.length);
        return ayahContent.split('\n').map((line, index) => {
            const trimmedLine = line.trimEnd(); // Remove extra spaces at the end of the line
            console.log(trimmedLine);
            return (
            <View key={index} style={[styles.lineWrapper]}>
                {trimmedLine.split(' ').map((word, index) => (
                <Text key={index} style={[styles.ayahText, { color: "white" }]}>{word}</Text>
                ))}
            </View>
            );
        });
    };

    return (
        <View style={styles.textAreaContainer}>
            {fontLoaded && renderAyahLines()}
        </View>
    );
};

export default MoshafPage;

const styles = StyleSheet.create({
    textAreaContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'balck',
        writingDirection: 'rtl',
        direction: 'rtl',
    },
    ayahText: {
        writingDirection : 'rtl',
        letterSpacing: 10,
        fontSize: 20,
        fontWeight: 'semibold',
        textAlign: "right",  // Ensures text stretches evenly
        fontFamily: 'UthmanicHafs',  // Font family for the text
          // Optional padding
    },
    lineWrapper: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 10,
        paddingVertical:0,
        width: "97%",
        justifyContent: 'space-between',
        textAlign: 'right',
        alignItems: 'center',
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
        marginVertical: 0,
    },
    
});
