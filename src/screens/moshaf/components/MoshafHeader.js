import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { indexTypesItems } from "../../moshaf-index/components/IndexData";

const Header = () => {
  const pageNumber = useSelector((state) => state.page.pageNumber); // Get pageNumber from Redux
  const [chapter, setChapter] = useState('');
  const [juz, setJuz] = useState('');

  const navigation = useNavigation();
  const goToIndexScreen = () => {
    const currentState = navigation.getState();
    const screenIndex = currentState.routes.findIndex(route => route.name ==='IndexPage');
    if(screenIndex !== -1) {
        const {routes} = navigation.getState();
        for (let i=0; i<routes.length-screenIndex; i++) {
          navigation.pop();
        }
        for (let i=0; i<routes.length-screenIndex-1; i++) {
          navigation.push(routes[screenIndex+i].name);
        }
    }
    navigation.navigate('IndexPage');
  }

  useEffect(() => {
    // Find the corresponding Surah based on the pageNumber
    const foundChapter = indexTypesItems.Chapter.find(
      (item, index, arr) => pageNumber >= item.pageNumber && (index === arr.length - 1 || pageNumber < arr[index + 1].pageNumber)
    );

    // Find the corresponding Juz based on the pageNumber
    const foundJuz = indexTypesItems.Juz.find(
      (item, index, arr) => pageNumber >= item.pageNumber && (index === arr.length - 1 || pageNumber < arr[index + 1].pageNumber)
    );

    setChapter(foundChapter ? foundChapter.name : 'Unknown Chapter');
    setJuz(foundJuz ? foundJuz.number : 'Unknown Juz');
  }, [pageNumber]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.titleContainer} onPress={() => goToIndexScreen()}>
        <Text style={styles.surahName}>{chapter}</Text>
        <Text style={styles.juzInfo}>الجزء {juz}</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#EFB975" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#EFB975" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#000',
    minWidth: '100%',
  },
  titleContainer: {
    marginLeft: 10,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#EFB975',
    padding: 5,
    marginRight: 10
  },
  surahName: {
    color: '#EFB975',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 20,
  },
  juzInfo: {
    color: '#EFB975',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 80,
    marginTop: 5,
  },
});
