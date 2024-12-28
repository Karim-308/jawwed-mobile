import React from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setPageNumber } from '../../../redux/actions/pageActions';
import { useNavigation } from '@react-navigation/native';

const Body = ({ bookmarks, loading, error, fontLoaded, handleDelete }) => {

  // Navigate to a the page with the bookmarked verse
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const goToVerse = (pageNumber) => {
    dispatch(setPageNumber(pageNumber));
    navigation.navigate('MoshafPage')
  }
  
  const renderBookmark = ({ item }) => (
    <View style={styles.bookmarkCard}>
      <TouchableOpacity onPress={() => goToVerse(item.page)}>
        <Text style={[styles.basmala, fontLoaded && { fontFamily: 'UthmanicHafs' }]}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </Text>
        <Text style={[styles.verse, fontLoaded && { fontFamily: 'UthmanicHafs' }]}>{item.verse}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.pageNumber}>Page: {item.page} </Text>
        <TouchableOpacity
          onPress={() => handleDelete(2, item.verseKey)} // Assuming userId = 2
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f0ad4e" />
        <Text style={styles.loadingText}>Loading bookmarks... </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error} </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.verseKey}
      renderItem={renderBookmark}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  bookmarkCard: {
    backgroundColor: '#1c1c1e',
    minWidth: '90%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  basmala: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  verse: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pageNumber: {
    color: '#f0ad4e',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Body;
