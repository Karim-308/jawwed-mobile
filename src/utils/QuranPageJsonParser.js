import message from '../api/mushaf/message.json';

const QuranPageJsonParser = () => {
    // Function to remove the '۝' symbol from a line
    const removeSymbol = (text) => {
        return text.replace(/۝/g, ''); // Removes all instances of ۝
    };

    const getLineText = (line) => {
        return message[line]['text']; // Fetches the text from the JSON
    };

    // This function extracts lines and removes the symbol
    const extractLinesTextFromPage = (message) => {

        return message.map(line => {
            if (line.lineNumber === 15) {
                return removeSymbol(line.text); // Fetch the text and add a newline
            }
            return removeSymbol(line.text) + "\n"; // Remove '۝' and join with a newline
        });
    };

    return extractLinesTextFromPage(message); // Return the Ayah content for the given line
};

export default QuranPageJsonParser;
