import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAzkarCategories } from '../../api/azkar/getAzkarCategories';
import { useNavigation } from '@react-navigation/native';
import { get } from '../../utils/localStorage/secureStore';
import Colors from '../../constants/newColors'; // adjust path as needed

const AzkarCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAzkarCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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

  const handleCardPress = (item) => {
    navigation.navigate('AzkarDetailsPage', {
      categoryId: item.categoryId,
      title: item.category,
    });
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => handleCardPress(item)}
    >
      <LinearGradient
        colors={['#d1d1d1', '#a8a8a8', '#787878']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <Text style={[styles.cardTitle, { color: currentColors.text }]}>
          {item.category}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <ActivityIndicator color={Colors.highlight} size="large" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.background },
      ]}
    >
      <FlatList
        data={categories}
        renderItem={renderCard}
        keyExtractor={(item) => item.categoryId.toString()}
        contentContainerStyle={styles.cardContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AzkarCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    paddingBottom: 30,
  },
  cardWrapper: {
    height: 60,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 25,
    fontFamily: 'UthmanicHafs',
    fontWeight: '600',
    textAlign: 'center',
  },
});
