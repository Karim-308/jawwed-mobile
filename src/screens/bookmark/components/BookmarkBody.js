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
          { backgroundColor: currentColors.cardBackground },
        ]}
      >
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.verse,
              { color: currentColors.text, fontFamily: 'digitalkhatt' },
            ]}
          >
            {item.verse}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.pageSurahContainer}>
            <Text style={[styles.pageNumber, { color: currentColors.text }]}>
              صفحة: {toArabicNumber(item.page)}
            </Text>
            <Text style={[styles.surahName, { color: currentColors.text }]}>
              {surahName}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleDelete(2, item.verseKey)}
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  cardContent: {
    marginBottom: 16,
  },
  verse: {
    fontSize: 20, // larger verse text
    paddingTop: 10,
    textAlign: 'center',
    lineHeight: 28,
  },
  pageSurahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pageNumber: {
    fontSize: 14,
    opacity: 0.8,
  },
  surahName: {
    fontSize: 14, // same size as page number
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  goToButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
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
