import message from '../api/mushaf/sajda.json';

const QuranPageJsonParser = () => {
    // Function to remove the '۝' symbol from a line
    const removeAndReplaceTajweedSymbols = (text) => {
        // Replace all instances of ۟ with the sukūn character ْ
        text = text.replace(/۟/g, 'ْ');  // SUKUN
        text = text.replace(/ࣰ/g, 'ٗ'); //FATHA
        text = text.replace(/ࣱ/g, 'ٞ'); //DAMMA
        text = text.replace(/ࣲ/g, 'ٖ'); //KASRA
        // Removes all instances of ۝
        return text.replace(/۝/g, '');
    };

    const getLineText = (line) => {
        return message[line]['text']; // Fetches the text from the JSON
    };

    // This function extracts lines and removes the symbol
    const extractLinesTextFromPage = (message) => {

        return message.map(line => {
            if (line.lineNumber === 15) {
                return removeAndReplaceTajweedSymbols(line.text); // Fetch the text and add a newline
            }
            return removeAndReplaceTajweedSymbols(line.text) + "\n"; // Remove '۝' and join with a newline
        });
    };

    return extractLinesTextFromPage(message); // Return the Ayah content for the given line
};

export default QuranPageJsonParser;
