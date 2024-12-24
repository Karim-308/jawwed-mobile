import message from '../../api/mushaf/response_examples/sajda.json';

const QuranPageJsonParser = () => {
    const removeAndReplaceTajweedSymbols = (text) => {
        text = text.replace(/۟/g, 'ْ'); 
        text = text.replace(/ࣰ/g, 'ٗ');
        text = text.replace(/ࣱ/g, 'ٞ');
        text = text.replace(/ࣲ/g, 'ٖ');
        text= text.replace(/۝/g,'');
        return text;
    };

    const extractLinesTextFromPage = (message) => {
        return message.flatMap(line => {
            const cleanedText = removeAndReplaceTajweedSymbols(line.text);
            const rawParts = cleanedText.split(/([٠-٩]+)/);

            // rawParts will now be something like:
            // [ "textBeforeNumber", "١٢", "textAfterNumber", "٣", "moreText", ... ]

            // We need to merge each captured digit sequence with the preceding text segment.
            const parts = [];
            for (let i = 0; i < rawParts.length; i += 2) {
                const segment = rawParts[i] || '';
                const number = rawParts[i + 1] || '';
                // Append the number sequence to the preceding segment
                parts.push(segment + number);
            }

            let verseIndex = 0;
            const ayahSegments = parts.map((part, index) => {
                
                if (part.length === 0) return null;

                const verse = line.verses[verseIndex];
                if (!verse) return null;

                const verseKey = `${line.surahNumber}:${verse.verseNumber}`;

                verseIndex++;
                return {
                    segmentID: `${line.lineID}-${verse.verseNumber}-${index}`,
                    lineID: line.lineID,
                    verseID: verse.verseID,
                    ayahNumber: verse.verseNumber,
                    verseKey,
                    text: part,
                    surahNumber: line.surahNumber
                };
            }).filter(Boolean);

            return ayahSegments;
        });
    };

    return extractLinesTextFromPage(message);
};

export default QuranPageJsonParser;
