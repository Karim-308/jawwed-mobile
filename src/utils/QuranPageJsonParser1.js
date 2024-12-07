import message from '../api/mushaf/sajda.json';

const QuranPageJsonParser = () => {
    // Function to remove and replace specific Tajweed symbols
    const removeAndReplaceTajweedSymbols = (text) => {
        text = text.replace(/۟/g, 'ْ');  // SUKUN
        text = text.replace(/ࣰ/g, 'ٗ');  // FATHA
        text = text.replace(/ࣱ/g, 'ٞ');  // DAMMA
        text = text.replace(/ࣲ/g, 'ٖ');  // KASRA
        return text; // Do not remove ۝ here; we use it to determine boundaries
    };

    // Extract each line, breaking it into segments using the separator symbol
    const extractLinesTextFromPage = (message) => {
        return message.flatMap(line => {
            const cleanedText = removeAndReplaceTajweedSymbols(line.text);
            const ayahSegments = [];

            // Split by the separator symbol (`۝`) to identify distinct ayah segments in the line
            const parts = cleanedText.split('۝');

            let verseIndex = 0;
            parts.forEach((part, index) => {
                const trimmedPart = part.trim();
                if (trimmedPart.length > 0) {
                    // Remove Arabic numbers indicating Ayah number, if present
                    const partWithoutNumber = trimmedPart.replace(/\d+/g, '').trim();

                    // Get corresponding verse from `verses` array
                    const verse = line.verses[verseIndex];
                    if (verse) {
                        ayahSegments.push({
                            segmentID: `${line.lineID}-${verse.verseNumber}-${index}`,
                            verseID: verse.verseID,
                            ayahNumber: verse.verseNumber,
                            text: partWithoutNumber,
                        });
                        verseIndex++;
                    }
                }
            });

            return ayahSegments;
        });
    };

    return extractLinesTextFromPage(message);
};

export default QuranPageJsonParser;
