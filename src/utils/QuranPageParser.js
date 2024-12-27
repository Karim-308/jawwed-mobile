const QuranPageJsonParser = (pageData) => {
    // Remove and Replace Tajweed Symbols
    const removeAndReplaceTajweedSymbols = (text) => {
        text = text.replace(/۟/g, 'ْ');  // Sukun
        text = text.replace(/ࣰ/g, 'ٗ');  // Fatha
        text = text.replace(/ࣱ/g, 'ٞ');  // Damma
        text = text.replace(/ࣲ/g, 'ٖ');  // Kasra
        text = text.replace(/۝/g, '');   // Ayah separator
        // Remove space before specific symbols
        text = text.replace(/\s([ۖۙۚۗۘ])/g, '$1');
        return text;
    };

    // Extract Lines and Clean Text
    const extractLinesTextFromPage = (pageData) => {
        console.log('Page Data:', pageData);
        return pageData.map(line => ({
            lineID: line.lineNumber,  // Use lineNumber as unique ID
            lineType: line.lineType,
            text: removeAndReplaceTajweedSymbols(line.text),
            verseKeys: line.versesKeys ? line.versesKeys.map(verse => verse.verseKey) : [], // Map verseKey directly
            isCentered: line.isCentered,
            surahNumber: line.surahNumber,
            juzNumber: line.juzNumber,
            hizbNumber: line.hizbNumber,
            rubHizbNumber: line.rubHizbNumber,
        }));
    };

    // Extract Unique Verse Keys and Audio (No Duplicates)
    const extractUniqueVerseKeysWithAudio = (pageData) => {
        const verseMap = {};

        pageData.forEach(line => {
            if (line.versesKeys && line.versesKeys.length > 0) {
                line.versesKeys.forEach(verse => {
                    if (!verseMap[verse.verseKey]) {
                        verseMap[verse.verseKey] = {
                            verseKey: verse.verseKey,
                            audio: verse.audio // Store all associated audio URLs
                        };
                    }
                });
            }
        });

        // Convert the map to an array of unique verse keys and audio
        return Object.values(verseMap);
    };

    // Parse the lines and unique verse keys with audio
    const linesData = extractLinesTextFromPage(pageData);
    const versesAudio = extractUniqueVerseKeysWithAudio(pageData);

    return { linesData, versesAudio };
};

export default QuranPageJsonParser;
