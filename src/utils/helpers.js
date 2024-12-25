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
      let ayahMap = {};  // Map ayahKey -> full ayah text
      let currentText = '';  // Text being collected for an ayah
      let previousAyahKey = null;  // Track previous ayah for text assignment
  
      console.log('Target VerseKey:', targetVerseKey);
  
      // Process line by line
        for (let line of linesData) {
        
        
            
        const words = line.text.split(' ');
        const surahNumber = line.surahNumber;
  
        for (let word of words) {
              const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)
  
              if (ayahNumberMatch) {

                    if (!previousAyahKey) {
                        previousAyahKey = `${surahNumber}:${linesData[0].verseKeys[0].split(':')[1]}`;
                     }
                  // Convert Arabic ayah number to English numerals
                  for (let numeral of ayahNumberMatch) {
                      const ayahNumber = toEnglishNumerals(numeral);
                      const ayahKey = `${surahNumber}:${ayahNumber}`;
  
                      // Assign the collected text to the previous ayah
                      if (previousAyahKey && currentText.trim()) {
                          if (ayahMap[previousAyahKey]) {
                              ayahMap[previousAyahKey] += ' ' + currentText.trim();
                          } else {
                              ayahMap[previousAyahKey] = currentText.trim();
                          }
                      }
  
                      // Reset text collection and set new ayah as ongoing
                      currentText = '';
                      previousAyahKey = ayahKey;
                  }
              } else {
                  // If no ayah number, keep appending to currentText
                  currentText += word + ' ';
              }
          }
      }
  
      // Final assignment (end of last line)
      if (previousAyahKey && currentText.trim()) {
          if (ayahMap[previousAyahKey]) {
              ayahMap[previousAyahKey] += ' ' + currentText.trim();
          } else {
              ayahMap[previousAyahKey] = currentText.trim();
          }
      }
  
      console.log('Collected Ayah Map:', ayahMap);
      console.log('Target Ayah:', ayahMap[targetVerseKey]);
  
      // Return text for the target ayah
      return ayahMap[targetVerseKey] || '';
  };
  

  {/*export const collectFullAyahText = (linesData, targetVerseKey) => {
      let ayahMap = {};  // Map ayahKey -> full ayah text
      let currentAyah = null;
      let currentText = '';
  
      console.log('Target VerseKey:', targetVerseKey);
  
      for (let line of linesData) {
          const words = line.text.split(' ');
          const surahNumber = line.surahNumber;
  
          for (let word of words) {
              const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)
  
              if (ayahNumberMatch) {
                  // Finalize text for the current ayah before assigning to the next
                  if (currentAyah && currentText.trim()) {
                      if (ayahMap[currentAyah]) {
                          ayahMap[currentAyah] += ' ' + currentText.trim();
                      } else {
                          ayahMap[currentAyah] = currentText.trim();
                      }
                  }
  
                  // Reset and prepare for the next ayah
                  currentText = '';
  
                  // Construct the ayah key for the preceding text
                  for (let numeral of ayahNumberMatch) {
                      const ayahNumber = toEnglishNumerals(numeral);  // Convert Arabic to English numerals
                      currentAyah = `${surahNumber}:${ayahNumber}`;   // Build the verseKey
                  }
              } else {
                  // Continue collecting text for the current ayah if no numeral is found
                  currentText += word + ' ';
              }
          }
  
          // Append remaining text to the current ayah at the end of the line
          if (currentAyah && currentText.trim()) {
              if (ayahMap[currentAyah]) {
                  ayahMap[currentAyah] += ' ' + currentText.trim();
              } else {
                  ayahMap[currentAyah] = currentText.trim();
              }
          }
      }
  
      console.log('Collected Ayah Map:', ayahMap);
      console.log('Target Ayah:', ayahMap[targetVerseKey]);
  
      // Return text for the target ayah
      return ayahMap[targetVerseKey] || '';
  };*/}
  

  {/*export const collectFullAyahText = (linesData, targetVerseKey) => {
    let ayahMap = {};  // Map ayahKey -> full ayah text
    let currentAyah = null;
    let currentText = '';

    console.log('Target VerseKey:', targetVerseKey);

    // Process line by line
    for (let line of linesData) {
        const words = line.text.split(' ');
        const surahNumber = line.surahNumber;  // Get surah number from line

        for (let word of words) {
            const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)

            if (ayahNumberMatch) {
                // Finalize text for the current ayah before assigning to the next
                if (currentAyah && currentText) {
                    if (ayahMap[currentAyah]) {
                        ayahMap[currentAyah] += ' ' + currentText.trim();
                    } else {
                        ayahMap[currentAyah] = currentText.trim();
                    }
                }

                // Reset and prepare for the next ayah after the numeral
                currentText = '';

                // Construct ayahKey dynamically based on ayah number
                for (let numeral of ayahNumberMatch) {
                    const ayahNumber = toEnglishNumerals(numeral);  // Convert Arabic to English numerals
                    currentAyah = `${surahNumber}:${ayahNumber}`;   // Construct the verseKey
                }
            } else {
                // Continue collecting text for the current ayah if no numeral is found
                currentText += word + ' ';
            }
        }

        // Append remaining text to the current ayah at the end of the line
        if (currentAyah && currentText) {
            if (ayahMap[currentAyah]) {
                ayahMap[currentAyah] += ' ' + currentText.trim();
            } else {
                ayahMap[currentAyah] = currentText.trim();
            }
        }
    }

    console.log('Collected Ayah Map:', ayahMap);
    console.log('Target Ayah:', ayahMap[targetVerseKey]);

    // Return text for the target ayah
    return ayahMap[targetVerseKey] || '';
};*/}

  {/*export const collectFullAyahText = (linesData, targetVerseKey) => {
    let ayahMap = {};  // Map ayahKey -> full ayah text
    let currentAyah = null;
    let currentText = '';
    let ayahIndex = 0;  // Track ayah position in verseKeys

    console.log('Target VerseKey:', targetVerseKey);

    // Start with the first ayah in the line
    if (linesData.length > 0 && linesData[0].verseKeys.length > 0) {
        currentAyah = linesData[0].verseKeys[0];
    }

    // Process line by line
    for (let line of linesData) {
        const words = line.text.split(' ');
        const verseKeys = line.verseKeys;

        for (let word of words) {
            const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)

            if (ayahNumberMatch) {
                // Finalize text for the current ayah before assigning to the next
                if (currentAyah && currentText) {
                    if (ayahMap[currentAyah]) {
                        ayahMap[currentAyah] += ' ' + currentText.trim();
                    } else {
                        ayahMap[currentAyah] = currentText.trim();
                    }
                }

                // Reset and prepare for the next ayah after the numeral
                currentText = '';

                // Get the ayah number from the numeral (end of ayah)
                for (let numeral of ayahNumberMatch) {
                    const ayahNumber = toEnglishNumerals(numeral);
                    const ayahKey = verseKeys.find(vk => vk.split(':')[1] == ayahNumber);

                    if (ayahKey) {
                        ayahIndex = verseKeys.indexOf(ayahKey);  // Track ayah position
                        currentAyah = ayahKey;
                    }
                }
            } else {
                // Continue collecting text for the current ayah if no numeral is found
                currentText += word + ' ';
            }
        }

        // Append remaining text to the current ayah at the end of the line
        if (currentAyah && currentText) {
            if (ayahMap[currentAyah]) {
                ayahMap[currentAyah] += ' ' + currentText.trim();
            } else {
                ayahMap[currentAyah] = currentText.trim();
            }
        }
    }

    console.log('Collected Ayah Map:', ayahMap);
    console.log('Target Ayah:', ayahMap[targetVerseKey]);

    // Return text for the target ayah
    return ayahMap[targetVerseKey] || '';
};*/}



 {/*} export const collectFullAyahText = (linesData, targetVerseKey) => {
    let ayahMap = {};  // Map ayahKey -> full ayah text
    let currentAyah = null;
    let currentText = '';
    let lastKnownAyah = null;

    console.log('Target VerseKey:', targetVerseKey);

    // Process line by line
    for (let line of linesData) {
        const words = line.text.split(' ');
        const verseKeys = line.verseKeys;  // Array of verseKeys in this line

        for (let word of words) {
            const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)

            if (ayahNumberMatch) {
                // Finalize text for the current ayah before assigning to the next
                if (currentAyah && currentText) {
                    if (ayahMap[currentAyah]) {
                        ayahMap[currentAyah] += ' ' + currentText.trim();
                    } else {
                        ayahMap[currentAyah] = currentText.trim();
                    }
                }

                currentText = '';  // Reset for new ayah

                // Assign the current ayah to the last detected ayah
                for (let numeral of ayahNumberMatch) {
                    const ayahNumber = toEnglishNumerals(numeral);
                    const ayahKey = verseKeys.find(vk => vk.split(':')[1] == ayahNumber);

                    if (ayahKey) {
                        lastKnownAyah = ayahKey;  // Set to ayah that ended at this numeral
                    }
                }
            } else {
                // Continue collecting text for the active ayah
                currentText += word + ' ';
            }
        }

        // At the end of the line, append text to the last known ayah
        if (lastKnownAyah && currentText) {
            if (ayahMap[lastKnownAyah]) {
                ayahMap[lastKnownAyah] += ' ' + currentText.trim();
            } else {
                ayahMap[lastKnownAyah] = currentText.trim();
            }
        }
    }

    console.log('Collected Ayah Map:', ayahMap);
    console.log('Target Ayah:', ayahMap[targetVerseKey]);
    // Return text for the target ayah
    return ayahMap[targetVerseKey] || '';
};*/}


  {/*export const collectFullAyahText = (linesData, targetVerseKey) => {
    let ayahMap = {};  // Map ayahKey -> full ayah text
    let currentAyah = null;
    let currentText = '';
    let lastDetectedAyah = null;  // Track the ayah key before the numeral

    console.log('Target VerseKey:', targetVerseKey);

    // Process line by line
    for (let line of linesData) {
        const words = line.text.split(' ');
        const verseKeys = line.verseKeys;   // Array of verseKeys in this line

        for (let word of words) {
            const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)

            if (ayahNumberMatch) {
                // Finalize the current ayah text before switching
                if (lastDetectedAyah && currentText) {
                    if (ayahMap[lastDetectedAyah]) {
                        ayahMap[lastDetectedAyah] += ' ' + currentText.trim();
                    } else {
                        ayahMap[lastDetectedAyah] = currentText.trim();
                    }
                }

                // Reset and prepare for the next ayah after the numeral
                currentText = '';

                // Get the ayah number from the numeral (end of ayah)
                for (let numeral of ayahNumberMatch) {
                    const ayahNumber = toEnglishNumerals(numeral);  // Convert Arabic numeral to English
                    const ayahKey = verseKeys.find(vk => vk.split(':')[1] == ayahNumber);

                    if (ayahKey) {
                        lastDetectedAyah = ayahKey;  // The ayah that just ended
                        currentAyah = ayahKey;       // Set as active ayah
                    }
                }
            } else {
                // Append the word to the current ayah text if no numeral is found
                currentText += word + ' ';
            }
        }

        // At the end of the line, append remaining text to the current ayah
        if (currentAyah && currentText) {
            if (ayahMap[currentAyah]) {
                ayahMap[currentAyah] += ' ' + currentText.trim();
            } else {
                ayahMap[currentAyah] = currentText.trim();
            }
        }
    }

    console.log('Collected Ayah Map:', ayahMap);
    console.log('Target Ayah:', ayahMap[targetVerseKey]);

    // Return text for the target ayah
    return ayahMap[targetVerseKey] || '';
};*/}

  {/*export const collectFullAyahText = (linesData, targetVerseKey) => {
      let ayahMap = {};  // Map ayahKey -> full ayah text
      let currentAyah = null;
      let currentText = '';
  
      console.log('Target VerseKey:', targetVerseKey);
  
      // Process line by line
      for (let line of linesData) {
          const words = line.text.split(' ');
          const verseKeys = line.verseKeys;   // Array of verseKeys in this line
  
          for (let word of words) {
              const ayahNumberMatch = word.match(/[٠١٢٣٤٥٦٧٨٩]+/g);  // Detect Arabic numerals (ayah numbers)
  
              if (ayahNumberMatch) {
                  // Finalize ayah text for the currently active ayah
                  if (currentAyah && currentText) {
                      if (ayahMap[currentAyah]) {
                          ayahMap[currentAyah] += ' ' + currentText.trim();
                      } else {
                          ayahMap[currentAyah] = currentText.trim();
                      }
                  }
  
                  // Reset and prepare for the next ayah after the numeral
                  currentText = '';
  
                  // Get the ayah number from the numeral (end of ayah)
                  for (let numeral of ayahNumberMatch) {
                    const ayahNumber = toEnglishNumerals(numeral);  // Convert Arabic numeral to English
                    const ayahKey = verseKeys.find(vk => vk.split(':')[1] == ayahNumber);
  
                      if (ayahKey) {
                          currentAyah = ayahKey;  // Set current ayah to the ayahKey just finished
                      }
                  }
              } else {
                  // Continue collecting text for the current ayah if no numeral is found
                  currentText += word + ' ';
              }
          }
  
          // At the end of the line, append to the current ayah
          if (currentAyah && currentText) {
              if (ayahMap[currentAyah]) {
                  ayahMap[currentAyah] += ' ' + currentText.trim();
              } else {
                  ayahMap[currentAyah] = currentText.trim();
              }
          }
      }
  
      console.log('Collected Ayah Map:', ayahMap);
      console.log('Target Ayah:', ayahMap[targetVerseKey]);
      // Return text for the target ayah
      return ayahMap[targetVerseKey] || '';
  };*/}
  




  