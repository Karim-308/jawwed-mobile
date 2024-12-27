import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.clock}>04:41</Text>
        <Text style={styles.prayerTime}>Fajr 3 hour 9 min left</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#EFB975" />
          <TextInput
            placeholder="Search here..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
          <MaterialIcons name="language" size={24} color="#EFB975" />
          <MaterialIcons name="notifications" size={24} color="#EFB975" />
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Features</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Feature 1: Index Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('IndexPage')}
          >
            <MaterialIcons name="menu-book" size={40} color="#EFB975" />
            <Text style={styles.featureText}>Index Page</Text>
          </TouchableOpacity>

          {/* Feature 2: Moshaf Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('MoshafPage')}
          >
            <MaterialIcons name="import-contacts" size={40} color="#EFB975" />
            <Text style={styles.featureText}>Moshaf Page</Text>
          </TouchableOpacity>

          {/* Feature 3: Bookmark Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('BookmarkPage')}
          >
            <MaterialIcons name="bookmark" size={40} color="#EFB975" />
            <Text style={styles.featureText}>Bookmark Page</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  clock: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  prayerTime: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    color: '#FFF',
  },
  features: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  featureItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  featureText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 5,
  },
});
