import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { indexTypesItems } from '../../moshaf-index/components/IndexData';
import BookIcon from '../../../assets/images/open-book.png';
import Basmallah from '../../../assets/images/basmallah.png';
import LastReadIcon from '../../../assets/images/last-read.png';
import { setPageNumber } from '../../../redux/actions/pageActions';
import { goToScreenWithoutNestingInStack } from '../../../utils/navigation-utils/NavigationUtils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 131;

const toArabicNumber = (num) => num.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

const LastReadCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pageNumber = useSelector((state) => state.page.pageNumber);
  const foundChapter = indexTypesItems.Chapter.find(
    (item, index, arr) => pageNumber >= item.pageNumber && (index === arr.length - 1 || pageNumber < arr[index + 1].pageNumber)
  );
  const surahName = foundChapter ? foundChapter.name : '';

  const handlePress = () => {
    dispatch(setPageNumber(pageNumber));
    goToScreenWithoutNestingInStack(navigation, 'MoshafPage');
  };

  const CardContent = () => (
    <View style={styles.lastReadCard}>
      <View style={styles.topRow}>
        <View style={styles.lastReadHeader}>
          <Image source={LastReadIcon} style={styles.lastReadIcon} />
          <Text style={styles.lastReadText}>آخر قراءة</Text>
        </View>
        <Image source={Basmallah} style={styles.basmallah} />
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.bookImageContainer}>
          <Image source={BookIcon} style={styles.bookImage} />
        </View>
        <View style={styles.lastReadInfo}>
          <Text style={styles.surahName}>{surahName}</Text>
          <Text style={styles.pageNumber}>صفحة رقم: {toArabicNumber(pageNumber)}</Text>
        </View>
      </View>
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <View style={styles.touchableContainer}>
        <TouchableNativeFeedback
          onPress={handlePress}
          background={TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.3)', false)}
          useForeground={true}
        >
          <View style={styles.touchableContent}>
            <CardContent />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <CardContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 12,
  },
  touchableContent: {
    width: '100%',
    height: '100%',
  },
  lastReadCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#F5C77B',
    borderRadius: 16,
    alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 12,
  },
  lastReadHeader: {
    flexDirection: 'row',
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
    marginLeft: 8,
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
    paddingHorizontal: 12,
    paddingBottom: 10,
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
    justifyContent: 'flex-start',
    paddingBottom: 0,
  },
  bookImage: {
    width: 128,
    height: 80,
    resizeMode: 'contain',
  },
});

export default LastReadCard; 