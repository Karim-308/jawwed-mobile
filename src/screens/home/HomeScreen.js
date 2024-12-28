import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PrayerTimes, CalculationMethod, Coordinates, Madhab } from 'adhan'; // Correct Madhab import

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Set up location coordinates
    const coordinates = new Coordinates(30.0444, 31.2357); // Cairo, Egypt
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi; // Correctly assign Madhab

    const calculatePrayerTimes = () => {
      const now = new Date();
      const prayerTimes = new PrayerTimes(coordinates, now, params);
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      const prayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const nextPrayerKey = prayerKeys.find(
        (key) => prayerTimes[key] && now < prayerTimes[key]
      );

      if (nextPrayerKey) {
        setNextPrayer(nextPrayerKey.charAt(0).toUpperCase() + nextPrayerKey.slice(1)); // Capitalize
        const timeDifference = prayerTimes[nextPrayerKey] - now;
        const hours = Math.floor(timeDifference / 1000 / 60 / 60);
        const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setNextPrayer('None');
        setTimeLeft('');
      }
    };

    calculatePrayerTimes();
    const interval = setInterval(calculatePrayerTimes, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.clock}>{currentTime}</Text>
        <Text style={styles.prayerTime}>
          {nextPrayer ? `${nextPrayer} - ${timeLeft}` : 'No upcoming prayer'}
        </Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="language" size={24} color="#EFB975" />
          <MaterialIcons name="notifications" size={24} color="#EFB975" />
          <TextInput
            placeholder='انقر هنـــا للبحث'
            writingDirection='rtl'
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
          <MaterialIcons name="search" size={24} color="#EFB975" />
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View flexDirection="row" style={{width:"100%",justifyContent:'center'}}>
          {/* Feature 1: Index Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('IndexPage')}
          >
            <MaterialIcons name="menu-book" size={60} color="#EFB975" />
            <Text style={styles.featureText}>الفهرس</Text>
          </TouchableOpacity>

          {/* Feature 2: Moshaf Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('MoshafPage')}
          >
            <MaterialIcons name="import-contacts" size={60} color="#EFB975" />
            <Text style={styles.featureText}>المصحف</Text>
          </TouchableOpacity>

          {/* Feature 3: Bookmark Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('BookmarkPage')}
          >
            <Ionicons name="bookmarks-outline" size={60} color="#EFB975" />
            <Text style={styles.featureText}>الإشارات المرجعية</Text>
          </TouchableOpacity>
        </View>
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
    textAlign: 'center',
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
