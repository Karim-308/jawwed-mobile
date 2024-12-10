import message from '../api/mushaf/sajda.json';

const QuranPageJsonParser = () => {
    const removeAndReplaceTajweedSymbols = (text) => {
        text = text.replace(/۟/g, 'ْ'); 
        text = text.replace(/ࣰ/g, 'ٗ');
        text = text.replace(/ࣱ/g, 'ٞ');
        text = text.replace(/ࣲ/g, 'ٖ');
        text = text.replace(/۝/g,'');
        return text;
    };

    const extractLinesTextFromPage = (message) => {
        return message.map(line => {
            return {
                lineID: line.lineID,
                text: removeAndReplaceTajweedSymbols(line.text),
                verseKeys: line.versesKeys ? line.versesKeys.split(',') : [], 
                isCentered: line.isCentered
            };
        });
    };

    return extractLinesTextFromPage(message);
};

export default QuranPageJsonParser;
