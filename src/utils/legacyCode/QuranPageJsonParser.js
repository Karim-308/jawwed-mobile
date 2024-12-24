const QuranPageJsonParser = (pageData) => {
    const removeAndReplaceTajweedSymbols = (text) => {
        text = text.replace(/۟/g, 'ْ'); 
        text = text.replace(/ࣰ/g, 'ٗ');
        text = text.replace(/ࣱ/g, 'ٞ');
        text = text.replace(/ࣲ/g, 'ٖ');
        text = text.replace(/۝/g,'');
        return text;
    };

    const extractLinesTextFromPage = (pageData) => {
        console.log('Page Data:', pageData);
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
