export const toArabicNumber = (number) => {
    return number.toString().replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[digit]);
  };
  