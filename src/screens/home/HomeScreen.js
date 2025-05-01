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
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PrayerTimes, CalculationMethod, Coordinates, Madhab } from "adhan";
import { get } from "../../utils/localStorage/secureStore"; // Adjust the import path as necessary

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
        const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);
        nextPrayerKey = "fajr";
        const timeDifference = Math.floor((tomorrowPrayerTimes.fajr - now) / 1000);
        setNextPrayer(prayerNamesArabic[nextPrayerKey]);
        setRemainingSeconds(timeDifference);
      } else {
        const timeDifference = Math.floor((prayerTimes[nextPrayerKey] - now) / 1000);
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
    return `${toArabicNumber(hrs)}:${toArabicNumber(mins)}:${toArabicNumber(secs)}`;
  };

  const toArabicNumber = (num) => {
    return num.toString().padStart(2, "0").replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/home_background.png")}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate("ProfilePage")}
        >
          <Ionicons name="person-circle-outline" size={60} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.clock}>{currentTime}</Text>
          <Text style={styles.prayerTime}>
            {nextPrayer
              ? `متبقي ${formatTime(remainingSeconds)} لصلاة ${nextPrayer}`
              : "لا يوجد صلاة قادمة"}
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

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>القــائــــــمة</Text>

        <View style={styles.featuresList}>
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("IndexPage")}
          >
            <MaterialIcons name="menu-book" size={60} color="#EFB975" />
            <Text style={styles.featureText}>الفهرس</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("MoshafPage")}
          >
            <MaterialIcons name="import-contacts" size={60} color="#EFB975" />
            <Text style={styles.featureText}>المصحف</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("BookmarkPage")}
          >
            <Ionicons name="bookmarks-outline" size={60} color="#EFB975" />
            <Text style={styles.featureText}>الإشارات المرجعية</Text>
          </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("PrayerTimesPage")}
          >
            <Ionicons name="time-outline" size={60} color="#EFB975" />
            <Text style={styles.featureText}>مواقيت الصلاة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("QuizPage")}
          >
            <FontAwesome5 name="chalkboard-teacher" size={60} color="#EFB975" />
            <Text style={styles.featureText}>اختبار القرآن</Text>
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
    fontSize: 20,
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
  profileIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
