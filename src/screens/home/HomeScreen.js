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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PrayerTimes, CalculationMethod, Coordinates, Madhab } from "adhan";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const coordinates = new Coordinates(30.0444, 31.2357); // Cairo
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi;

    const calculatePrayerTimes = () => {
      const now = new Date();
      const prayerTimes = new PrayerTimes(coordinates, now, params);
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );

      const prayerKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
      const nextPrayerKey = prayerKeys.find(
        (key) => prayerTimes[key] && now < prayerTimes[key]
      );

      if (nextPrayerKey) {
        setNextPrayer(
          nextPrayerKey.charAt(0).toUpperCase() + nextPrayerKey.slice(1)
        );
        const timeDifference = prayerTimes[nextPrayerKey] - now;
        const hours = Math.floor(timeDifference / 1000 / 60 / 60);
        const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setNextPrayer("None");
        setTimeLeft("");
      }
    };

    calculatePrayerTimes();
    const interval = setInterval(calculatePrayerTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with background */}
      <ImageBackground
        source={require("../../assets/images/home_background.png")}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Text style={styles.clock}>{currentTime}</Text>
          <Text style={styles.prayerTime}>
            {nextPrayer ? `${nextPrayer} - ${timeLeft}` : "No upcoming prayer"}
          </Text>

          <View style={styles.searchContainer}>
            <MaterialIcons name="language" size={24} color="#EFB975" />
            <MaterialIcons name="notifications" size={24} color="#EFB975" />
            <TextInput
              placeholder="انقر هنـــا للبحث"
              placeholderTextColor="#666"
              writingDirection="rtl"
              style={styles.searchInput}
            />
            <MaterialIcons name="search" size={24} color="#EFB975" />
          </View>
        </View>
      </ImageBackground>

      {/* Features Section */}
      <View style={styles.features}>
        {/* Section Title */}
        <Text style={styles.sectionTitle}>القــائــــــمة</Text>

        {/* Features Buttons */}
        <View style={styles.featuresList}>
          {/* Index Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("IndexPage")}
          >
            <MaterialIcons name="menu-book" size={60} color="#EFB975" />
            <Text style={styles.featureText}>الفهرس</Text>
          </TouchableOpacity>

          {/* Moshaf Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("MoshafPage")}
          >
            <MaterialIcons name="import-contacts" size={60} color="#EFB975" />
            <Text style={styles.featureText}>المصحف</Text>
          </TouchableOpacity>

          {/* Bookmark Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("BookmarkPage")}
          >
            <Ionicons name="bookmarks-outline" size={60} color="#EFB975" />
            <Text style={styles.featureText}>الإشارات المرجعية</Text>
          </TouchableOpacity>

          {/* Azkar Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("AzkarPage")}
          >
            <Image
              source={require("../../assets/images/AzkarIcon.png")}
              style={styles.azkarImage}
              resizeMode="contain"
            />
            <Text style={styles.featureText}>الأذكار</Text>
          </TouchableOpacity>

          {/* Prayer Times Page */}
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate('PrayerTimesPage')}
          >
            <Ionicons name="time-outline" size={60} color="#EFB975" />
            <Text style={styles.featureText}>مواقيت الصلاة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    color: "#FFF",
  },
  prayerTime: {
    fontSize: 16,
    color: "#FFF",
    marginTop: 5,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    color: "#FFF",
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
    color: "#FFF",
    marginBottom: 20,
    textAlign: "right",
  },
  featuresList: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "flex-start",
  },
  featureItem: {
    alignItems: "center",
    margin: 10,
  },
  featureText: {
    fontSize: 12,
    color: "#FFF",
    marginTop: 5,
    textAlign: "center",
  },
  azkarImage: {
    width: 60,
    height: 60,
    tintColor: "#EFB975",
  },
});
