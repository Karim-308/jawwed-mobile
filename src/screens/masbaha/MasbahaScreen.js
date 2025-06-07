// screens/MasbahaScreen.js

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Vibration,
  Animated,
  Easing,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/newColors"; // Adjust path if needed
import { get } from "../../utils/localStorage/secureStore"; // Adjust path if needed
import {
  getAllSebhaCounts,
  saveSebhaCount,
  resetSebhaCount,
} from "../../utils/database/countsRepository";

const { width } = Dimensions.get("window");
const DIGIT_HEIGHT = 50; // Customize this to match the digit text size

const initialSebhas = [
  { id: 1, name: "سبحان الله", count: 0 },
  { id: 2, name: "الحمد لله", count: 0 },
  { id: 3, name: "لا إله إلا الله", count: 0 },
  { id: 4, name: "الله أكبر", count: 0 },
  { id: 5, name: "رب اغفر لي", count: 0 },
  { id: 6, name: "أستغفر الله", count: 0 },
  { id: 7, name: "لا حول ولا قوة إلا بالله", count: 0 },
];

// DigitRoller Component
const DigitRoller = ({ digit, digitColor }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: -digit * DIGIT_HEIGHT,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [digit]);

  return (
    <View style={styles.digitContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {Array.from({ length: 11 }, (_, i) => (
          <Text key={i} style={[styles.digitText, { color: digitColor }]}>
            {i % 10}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

export default function MasbahaScreen() {
  const [sebhas, setSebhas] = useState([...initialSebhas]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Load dark mode from storage
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

  // Load counts from SQLite
  useEffect(() => {
    const loadSebhaCounts = async () => {
      const storedCounts = await getAllSebhaCounts();
      setSebhas((prev) =>
        prev.map((sebha) => ({
          ...sebha,
          count: storedCounts[sebha.id] ?? 0,
        }))
      );
      setLoading(false);
    };
    loadSebhaCounts();
  }, []);

  const theme = darkMode ? Colors.dark : Colors.light;
  const golden = Colors.dark.underline; // "#E0A500"

  const incrementSebha = (id) => {
    const index = sebhas.findIndex((sebha) => sebha.id === id);
    const currentCount = sebhas[index]?.count || 0;
    const newCount = currentCount + 1;

    // Vibration feedback
    if (newCount % 33 === 0) {
      Vibration.vibrate(500);
    } else {
      Vibration.vibrate(50);
    }

    setSebhas((prev) =>
      prev.map((sebha) =>
        sebha.id === id ? { ...sebha, count: newCount } : sebha
      )
    );

    saveSebhaCount(id, newCount);
  };

  const resetSebha = (id) => {
    setSebhas((prev) =>
      prev.map((sebha) =>
        sebha.id === id ? { ...sebha, count: 0 } : sebha
      )
    );
    saveSebhaCount(id, 0);
    resetSebhaCount(id);
  };

  const renderItem = ({ item }) => {
    const countStr = item.count.toString();
    const digits = countStr.split("").map(Number);

    return (
      <View style={styles.page}>
        <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.largeCircle,
            {
              backgroundColor: golden,
              shadowColor: golden,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 7,
            },
          ]}
          onPress={() => incrementSebha(item.id)}
          activeOpacity={0.85}
        >
          <View style={styles.digitsWrapper}>
            {digits.map((digit, index) => (
              <DigitRoller key={index} digit={digit} digitColor={theme.text} />
            ))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.resetButton,
            { backgroundColor: "#e74c3c" },
          ]}
          onPress={() => resetSebha(item.id)}
        >
          <Text style={[styles.resetButtonText, { color: "#fff" }]}>إعادة</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={golden} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={sebhas}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setSelectedIndex(index);
        }}
      />
      {/* Page Indicator */}
      <View style={styles.dotsContainer}>
        {sebhas.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: theme.separator },
              selectedIndex === index && { backgroundColor: golden, width: 14, height: 14 },
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    width,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontFamily: "PRO",
    marginBottom: 20,
    textAlign: "center",
  },
  largeCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  digitsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  digitContainer: {
    height: DIGIT_HEIGHT,
    overflow: "hidden",
    width: 30,
    alignItems: "center",
    marginHorizontal: 2,
  },
  digitText: {
    height: DIGIT_HEIGHT,
    fontSize: 45,
    textAlign: "center",
    fontWeight: "bold",
  },
  resetButton: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 150,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 20,
    fontFamily: "UthmanicHafs"
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
