import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setPageNumber } from '../../../redux/actions/pageActions';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../constants/newColors';
import { get } from '../../../utils/localStorage/secureStore';
import { indexTypesItems } from '../../../screens/moshaf-index/components/IndexData';

const Body = ({ bookmarks, loading, error, handleDelete }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const loadDarkMode = async () => {
      const storedDarkMode = await get("darkMode");
      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true");
      } else {
        setDarkMode(true);
      }
    };
    loadDarkMode();
  }, []);

  const currentColors = darkMode ? Colors.dark : Colors.light;

  const toArabicNumber = (num) => {
    return num
      .toString()
      .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  const getNameByPageNumber = (pageNumber) => {
    const chapters = indexTypesItems.Chapter;
    let selectedChapter = chapters[0];
    for (let i = 0; i < chapters.length; i++) {
      if (pageNumber >= chapters[i].pageNumber) {
        selectedChapter = chapters[i];
      } else {
        break;
      }
    }
    return selectedChapter.name;
  };

  const goToVerse = (pageNumber) => {
    dispatch(setPageNumber(Number(pageNumber)));
    navigation.navigate('MoshafPage');
  };

  const renderBookmark = ({ item }) => {
    const surahName = getNameByPageNumber(item.page);

    return (
      <View
        style={[
          styles.bookmarkCard,
          { backgroundColor: currentColors.cardBackground || (darkMode ? '#23272f' : '#fff') },
        ]}
      >
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.verse,
              { color: currentColors.text, fontFamily: 'UthmanicHafs' },
            ]}
          >
            {item.verse}
          </Text>
        </View>
        <View style={[
          styles.divider,
          {
            backgroundColor: darkMode ? '#e0e0e0' : '#000',
            opacity: darkMode ? 0.18 : 0.3,
          }
        ]} />
        <View style={styles.footer}>
          <View style={styles.pageSurahContainer}>
            <Text style={[styles.pageNumber, { color: currentColors.text }]}>صفحة: {toArabicNumber(item.page)}</Text>
            <Text style={[styles.surahName, { color: currentColors.text }]}>{surahName}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleDelete(item.verseKey)}
              style={[styles.deleteButton, { backgroundColor: '#ff4d4d' }]}
            >
              <Text style={styles.buttonText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => goToVerse(item.page)}
              style={[styles.goToButton, { backgroundColor: Colors.highlight }]}
            >
              <Text style={styles.buttonText}>اذهب</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.highlight} />
        <Text
          style={[styles.loadingText, { color: currentColors.loadingText }]}
        >
          جاري التحميل...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text
          style={[styles.errorText, { color: currentColors.errorText }]}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.verseKey}
      renderItem={renderBookmark}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 2,
  },
  bookmarkCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 7,
    borderWidth: 0,
  },
  cardContent: {
    marginBottom: 18,
  },
  verse: {
    fontSize: 24,
    paddingTop: 10,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  pageSurahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
  },
  pageNumber: {
    fontSize: 15,
    opacity: 0.7,
    fontWeight: '500',
  },
  surahName: {
    fontSize: 15,
    opacity: 0.7,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  goToButton: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
});

export default Body;
