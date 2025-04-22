// for styling the background of each item (card)
export const getItemBackgroundColor = (prayerName) => {
    
    switch (prayerName) {
    case 'الفجر':
        return '#33506A';
    case 'الشروق':
        return '#3871BF';
    case 'الظهر':
        return '#55ABF6';
    case 'العصر':
        return '#F4A733';
    case 'المغرب':
        return '#BA3936';
    case 'العشاء':
        return '#312BAB';
    case 'منتصف الليل':
        return '#20078A';
    case 'ثلث الليل الأخير':
        return '#200340';
    default:
        return '#222';
    }
}