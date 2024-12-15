import message from '../api/mushaf/database1.json';

const QuranPageJsonParser = (pageNumber) => {
    const removeAndReplaceTajweedSymbols = (text) => {
        text = text.replace(/۟/g, 'ْ'); 
        text = text.replace(/ࣰ/g, 'ٗ');
        text = text.replace(/ࣱ/g, 'ٞ');
        text = text.replace(/ࣲ/g, 'ٖ');
        text = text.replace(/۝/g,'');
        return text;
    };

    let pageData = message[pageNumber - 1];

    const extractLinesTextFromPage = (pageData) => {
        return pageData.map(line => {
            return {
                lineID: line.lineID,
                text: removeAndReplaceTajweedSymbols(line.text),
                verseKeys: line.versesKeys ? line.versesKeys.split(',') : [], 
                isCentered: line.isCentered
            };
        });
    };

    return extractLinesTextFromPage(pageData);
};

export default QuranPageJsonParser;
