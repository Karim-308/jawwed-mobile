// reformat the words so it's easier for the user to search for them
// the user won't need to type special arabic characters
export const reformatWord = (word) => {

    let reformatedWord = '';

    for(let i=0; i<word.length; i++) {
        if(['أ', 'إ', 'آ'].includes(word[i])) {
            reformatedWord += 'ا';
        }
        else if (word[i].match(/[(\u064E-\u0652)|ـ]/)) {
            continue;
        }
        else {
            reformatedWord += word[i];
        }
    }  
    
    return reformatedWord;
}