// Convert English numbers (0-9) to Arabic numerals (٠-٩)
export const toArabicNumerals = (number) => {
    const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
    return number.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
  };
  

  export const toEnglishNumerals = (number) => {
    const englishNumbers = '0123456789';
    const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
    return number.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (digit) => englishNumbers[arabicNumbers.indexOf(digit)]);
};
  // Example
  console.log(toArabicNumerals(6));  // Outputs: "٦"
  


  export const collectFullAyahText = (linesData, targetVerseKey) => {
    const ayahTexts = new Map();
    let currentText = '';
    
    const arabicToEnglishNumbers = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
  
    const convertToEnglishNumber = (arabicNum) => {
      return arabicNum.split('').map(char => arabicToEnglishNumbers[char] || char).join('');
    };
  
    for (const line of linesData) {
      if (line.lineType !== 'ayah') continue;
  
      const words = line.text.split(' ');
      
      for (const word of words) {
        // Check if word is an Arabic numeral
        if (/^[٠-٩]+$/.test(word)) {
          if (currentText) {
            const verseKey = `${line.surahNumber}:${convertToEnglishNumber(word)}`;
            ayahTexts.set(verseKey, currentText.trim());
            currentText = ''; // Reset currentText for the next Ayah
          }
        } else {
          currentText += ' ' + word; // Append word to currentText
        }
      }
    }
  
    // Capture the last Ayah if it exists
    if (currentText) {
      const lastVerseKey = `${linesData[linesData.length - 1].surahNumber}:${convertToEnglishNumber(words[words.length - 1])}`;
      ayahTexts.set(lastVerseKey, currentText.trim());
    }
  
    console.log(ayahTexts.get(targetVerseKey));
    return ayahTexts.get(targetVerseKey) || '';
  };
  




  