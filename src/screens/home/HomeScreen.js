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

      const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
      const minutes = now.getMinutes();
      const isPM = now.getHours() >= 12;

      setCurrentTime(
        `${toArabicNumber(hours)}:${toArabicNumber(minutes)} ${
          isPM ? "م" : "ص"
        }`
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
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
          <Text style={[styles.clock, { color: currentColors.clock }]}>
            {currentTime.replace(/[صم]$/, "")}
            <Text style={styles.amPm}>
              {currentTime.slice(-1)} {/* This will be either "ص" or "م" */}
            </Text>
          </Text>

          <Text
            style={[styles.prayerTime, { color: currentColors.prayerTime }]}
          >
            {nextPrayer
              ? `متبقي ${formatTime(remainingSeconds)} لصلاة ${nextPrayer}`
              : "لا يوجد صلاة قادمة"}
          </Text>

          <View
            style={[
              styles.searchContainer,
              { backgroundColor: currentColors.searchBackground },
            ]}
          >
            <MaterialIcons name="language" size={24} color={Colors.highlight} />
            <MaterialIcons
              name="notifications"
              size={24}
              color={Colors.highlight}
            />
            <TextInput
              placeholder="انقر هنـــا للبحث"
              placeholderTextColor={currentColors.inputPlaceholder}
              writingDirection="rtl"
              style={[styles.searchInput, { color: currentColors.text }]}
            />
            <MaterialIcons name="search" size={24} color={Colors.highlight} />
          </View>
        </View>
      </ImageBackground>

      <View style={styles.features}>
        <Text
          style={[styles.sectionTitle, { color: currentColors.sectionTitle }]}
        >
          القــائــــــمة
        </Text>

        <View style={styles.featuresList}>
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("IndexPage")}
          >
            <MaterialIcons
              name="menu-book"
              size={60}
              color={Colors.highlight}
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              الفهرس
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("MoshafPage")}
          >
            <MaterialIcons
              name="import-contacts"
              size={60}
              color={Colors.highlight}
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              المصحف
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("BookmarkPage")}
          >
            <Ionicons
              name="bookmarks-outline"
              size={60}
              color={Colors.highlight}
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              الإشارات المرجعية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("AzkarPage")}
          >
            <Image
              source={require("../../assets/images/AzkarIcon.png")}
              style={[styles.azkarImage, { tintColor: Colors.highlight }]}
              resizeMode="contain"
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              الأذكار
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("PrayerTimesPage")}
          >
            <Ionicons name="time-outline" size={60} color={Colors.highlight} />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              مواقيت الصلاة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("QuizPage")}
          >
            <Image
              source={require("../../assets/images/quiz.png")}
              style={[styles.quizImage, { tintColor: Colors.highlight }]}
              resizeMode="contain"
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              اختبار القرآن
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("QiblahPage")}
          >
            <MaterialCommunityIcons
              name="compass-outline"
              size={60}
              color={Colors.highlight}
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              اتجاه القِبلة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => navigation.navigate("MasbahaPage")}
          >
            <Image
              source={require("../../assets/images/prayer-breads.png")}
              style={[styles.azkarImage, { tintColor: Colors.highlight }]}
              resizeMode="contain"
            />
            <Text
              style={[styles.featureText, { color: currentColors.featureText }]}
            >
              سبحة
            </Text>
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
    fontSize: 30,
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
    marginTop: 5,
    textAlign: "center",
  },
  azkarImage: {
    height: 60,
    width: 60,
  },
  quizImage: {
    height: 60,
    width: 60,
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
  amPm: {
  fontSize: 24,  
  lineHeight: 36, 
  marginLeft: 4,
  fontWeight: "normal",
},

});
