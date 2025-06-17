import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PrayerTimes, CalculationMethod, Coordinates, Madhab } from "adhan";
import { get } from "../../utils/localStorage/secureStore";
import Colors from "../../constants/newColors";
import { useSelector } from 'react-redux';
import { indexTypesItems } from '../moshaf-index/components/IndexData';
import BookIcon from '../../assets/images/open-book.png'; // adjust path if needed
import Basmallah from '../../assets/images/basmallah.png'; // adjust path if needed
import LastReadIcon from '../../assets/images/last-read.png'; // adjust path if needed
import LastReadCard from './components/LastReadCard';

const prayerNamesArabic = {
  fajr: "الفجر",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Define features data
  const features = [
    {
      id: 'index',
      name: 'الفهرس',
      icon: 'menu-book',
      iconType: 'MaterialIcons',
      screen: 'IndexPage'
    },
    {
      id: 'moshaf',
      name: 'المصحف',
      icon: 'import-contacts',
      iconType: 'MaterialIcons',
      screen: 'MoshafPage'
    },
    {
      id: 'bookmark',
      name: 'الإشارات المرجعية',
      icon: 'bookmarks-outline',
      iconType: 'Ionicons',
      screen: 'BookmarkPage'
    },
    {
      id: 'azkar',
      name: 'الأذكار',
      icon: 'AzkarIcon',
      iconType: 'Image',
      screen: 'AzkarPage'
    },
    {
      id: 'prayer',
      name: 'مواقيت الصلاة',
      icon: 'time-outline',
      iconType: 'Ionicons',
      screen: 'PrayerTimesPage'
    },
    {
      id: 'quiz',
      name: 'اختبار القرآن',
      icon: 'chalkboard-teacher',
      iconType: 'FontAwesome5',
      screen: 'QuizPage'
    },
    {
      id: 'qiblah',
      name: 'اتجاه القِبلة',
      icon: 'compass-outline',
      iconType: 'MaterialCommunityIcons',
      screen: 'QiblahPage'
    },
    {
      id: 'masbaha',
      name: 'سبحة',
      icon: 'AzkarIcon',
      iconType: 'Image',
      screen: 'MasbahaPage'
    }
  ];

  // Filter features based on search query
  const filteredFeatures = features.filter(feature =>
    feature.name.includes(searchQuery)
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadDarkMode = async () => {
        const storedDarkMode = await get("darkMode");
        if (storedDarkMode !== null) {
          setDarkMode(storedDarkMode === "true");
        } else {
          setDarkMode(true);
        }
      };
      loadDarkMode();
    }, [])
  );

  useEffect(() => {
    const coordinates = new Coordinates(30.0444, 31.2357); // Cairo
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi;

    const calculatePrayerTimes = () => {
      const now = new Date();
      const prayerTimes = new PrayerTimes(coordinates, now, params);

      setCurrentTime(
        now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
      );

      const prayerKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
      let nextPrayerKey = prayerKeys.find(
        (key) => prayerTimes[key] && now < prayerTimes[key]
      );

      if (!nextPrayerKey) {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowPrayerTimes = new PrayerTimes(
          coordinates,
          tomorrow,
          params
        );
        nextPrayerKey = "fajr";
        const timeDifference = Math.floor(
          (tomorrowPrayerTimes.fajr - now) / 1000
        );
        setNextPrayer(prayerNamesArabic[nextPrayerKey]);
        setRemainingSeconds(timeDifference);
      } else {
        const timeDifference = Math.floor(
          (prayerTimes[nextPrayerKey] - now) / 1000
        );
        setNextPrayer(prayerNamesArabic[nextPrayerKey]);
        setRemainingSeconds(timeDifference);
      }
    };

    calculatePrayerTimes();
    const prayerInterval = setInterval(calculatePrayerTimes, 60000);
    const countdownInterval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(prayerInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${toArabicNumber(hrs)}:${toArabicNumber(mins)}:${toArabicNumber(
      secs
    )}`;
  };

  const toArabicNumber = (num) => {
    return num
      .toString()
      .padStart(2, "0")
      .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  const renderIcon = (feature) => {
    switch (feature.iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={feature.icon} size={40} color={Colors.highlight} style={styles.iconShine} />;
      case 'Ionicons':
        return <Ionicons name={feature.icon} size={40} color={Colors.highlight} style={styles.iconShine} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={feature.icon} size={40} color={Colors.highlight} style={styles.iconShine} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={feature.icon} size={40} color={Colors.highlight} style={styles.iconShine} />;
      case 'Image':
        return (
          <Image
            source={require("../../assets/images/AzkarIcon.png")}
            style={[styles.azkarImage, { tintColor: Colors.highlight }, styles.iconShine]}
            resizeMode="contain"
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background, paddingTop: 24 }]}>
      <ImageBackground
        source={require("../../assets/images/home_background.png")}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate("ProfilePage")}
        >
          <Image
            source={require("../../assets/images/profileiconcopy.png")}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.clock, { color: currentColors.clock }]}>{currentTime}</Text>
          <Text style={[styles.prayerTime, { color: currentColors.prayerTime }]}>
            {nextPrayer
              ? `متبقي ${formatTime(remainingSeconds)} لصلاة ${nextPrayer}`
              : "لا يوجد صلاة قادمة"}
          </Text>

          <View style={[styles.searchContainer, { backgroundColor: currentColors.searchBackground }]}>
            <MaterialIcons name="language" size={24} color={Colors.highlight} />
            <MaterialIcons name="notifications" size={24} color={Colors.highlight} />
            <TextInput
              placeholder="انقر هنـــا للبحث"
              placeholderTextColor={currentColors.inputPlaceholder}
              writingDirection="rtl"
              style={[styles.searchInput, { color: currentColors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="clear" size={24} color={Colors.highlight} />
              </TouchableOpacity>
            ) : (
              <MaterialIcons name="search" size={24} color={Colors.highlight} />
            )}
          </View>
        </View>

      </ImageBackground>
      <View style={[styles.features, { backgroundColor: currentColors.background }]}>

      <View style={{ marginBottom: 5 }} />
      <LastReadCard />
        <Text style={[styles.sectionTitle, { color: currentColors.sectionTitle }]}>القــائــــــمة</Text>

        <View style={styles.featuresList}>
          {filteredFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureItem, { backgroundColor: currentColors.featureBackground }]}
              onPress={() => navigation.navigate(feature.screen)}
            >
              <View style={styles.iconContainer}>
                {renderIcon(feature)}
              </View>
              <Text style={[styles.featureText, { color: currentColors.featureText }]}>
                {feature.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  headerBackground: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 170,
  },
  clock: {
    fontSize: 36,
    fontWeight: "bold",
  },
  prayerTime: {
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    textAlign: "right",
    writingDirection: "rtl",
  },
  features: {
    marginVertical: 20,
    marginTop: 75,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "right",
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 5,
    gap: 15,
  },
  featureItem: {
    width: '22%',
    minWidth: 100,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#212020',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconShine: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  featureText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  azkarImage: {
    width: 40,
    height: 40,
  },
  profileIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
});
