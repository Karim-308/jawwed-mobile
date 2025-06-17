import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { indexTypesItems } from '../../moshaf-index/components/IndexData';
import BookIcon from '../../../assets/images/open-book.png';
import Basmallah from '../../../assets/images/basmallah.png';
import LastReadIcon from '../../../assets/images/last-read.png';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 131;

const toArabicNumber = (num) => num.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

const LastReadCard = () => {
  const pageNumber = useSelector((state) => state.page.pageNumber);
  const foundChapter = indexTypesItems.Chapter.find(
    (item, index, arr) => pageNumber >= item.pageNumber && (index === arr.length - 1 || pageNumber < arr[index + 1].pageNumber)
  );
  const surahName = foundChapter ? foundChapter.name : '';

  return (
    <View style={styles.lastReadCard}>
      <View style={styles.topRow}>
        <View style={styles.lastReadHeader}>
          <Image source={LastReadIcon} style={styles.lastReadIcon} />
          <Text style={styles.lastReadText}>آخر قراءة</Text>
        </View>
        <Image source={Basmallah} style={styles.basmallah} />
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.lastReadInfo}>
          <Text style={styles.surahName}>{surahName}</Text>
          <Text style={styles.pageNumber}>صفحة رقم: {toArabicNumber(pageNumber)}</Text>
        </View>
        <View style={styles.bookImageContainer}>
          <Image source={BookIcon} style={styles.bookImage} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lastReadCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#F5C77B',
    borderRadius: 16,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 12,
  },
  lastReadHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  lastReadIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  lastReadText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  basmallah: {
    width: 161,
    height: 36,
    resizeMode: 'contain',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 8,
  },
  lastReadInfo: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pageNumber: {
    fontSize: 14,
    color: '#333',
    marginTop: 1,
  },
  bookImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bookImage: {
    width: 128,
    height: 80,
    resizeMode: 'contain',
  },
});

export default LastReadCard; 