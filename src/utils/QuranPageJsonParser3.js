import message from '../api/mushaf/database1.json';

const QuranPageJsonParser = (pageNumber) => {
    // Function to remove the '۝' symbol from a line
    const removeSymbol = (text) => {
        return text.replace(/۝/g, ''); // Removes all instances of ۝
    };

    let pageData = message[pageNumber - 1]; // Get the page data from the JSON file

    // This function extracts lines and includes metadata
    const extractLinesWithMetadata = (pageData) => {
        return pageData.map(line => {
            // Remove the symbol from the text
            const cleanedText = removeSymbol(line.text);

            // Return the metadata along with the cleaned text
            return {
                lineNumber: line.lineNumber,    // Include line number
                pageNumber: line.pageNumber,    // Include page number if available
                surahNumber: line.surahNumber,  // Include surah number if available
                versesKeys: line.versesKeys,    // Include verse keys if available
                cleanedText: cleanedText + (line.lineNumber === 15 ? '' : '\n') // Cleaned text with or without newline
            };
        });
    };

    return extractLinesWithMetadata(pageData); // Return lines with metadata
};

export default QuranPageJsonParser;
