import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from "react-native";
import { getAzkarWithID } from "../../../api/azkar/getAzkarWithID";
import { toArabicNumber } from "../../../utils/format";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { get } from "../../../utils/localStorage/secureStore";
import Colors from "../../../constants/newColors";
import {
  getAllCounts,
  saveCount,
  resetCount,
} from "../../../utils/database/countsRepository";

I18nManager.forceRTL(true);

const AzkarDetails = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [playingZekrId, setPlayingZekrId] = useState(null);
  const [bufferingZekrId, setBufferingZekrId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const isAudioPlayingRef = useRef(false);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    (async () => {
      await fetchCategory();
      await fetchCounts();
    })();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const data = await getAzkarWithID(categoryId);
      setCategoryData(data);
      navigation.setOptions({
        title: data.category,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    await getAllCounts((loadedCounts) => {
      setCounts(loadedCounts);
    });
  };

  useEffect(() => {
    (async () => {
      const storedDarkMode = await get("darkMode");
      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true");
      } else {
        setDarkMode(true);
      }
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          (async () => {
            try {
              const status = await sound.getStatusAsync();
              if (status.isLoaded) {
                await sound.stopAsync();
                await sound.unloadAsync();
              }
            } catch (e) {}
            setSound(null);
            setPlayingZekrId(null);
            isAudioPlayingRef.current = false;
          })();
        }
      };
    }, [sound])
  );

  const currentColors = darkMode ? Colors.dark : Colors.light;

  // --- Audio Playback with Buffering ---
  const handleToggleAudio = async (item) => {
    // If buffering now, ignore tap
    if (bufferingZekrId) return;

    // If playing, stop & unload
    if (playingZekrId === item.zekrID) {
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
        } catch (e) {}
        setSound(null);
        setPlayingZekrId(null);
        isAudioPlayingRef.current = false;
      }
      return;
    }

    // If any sound loaded, unload first
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (e) {}
      setSound(null);
      setPlayingZekrId(null);
      isAudioPlayingRef.current = false;
    }

    // Start buffering
    setBufferingZekrId(item.zekrID);

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.audio },
        { shouldPlay: false }
      );

      setSound(newSound);
      setPlayingZekrId(item.zekrID);
      isAudioPlayingRef.current = true;

      // Set callback for finish
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingZekrId(null);
          isAudioPlayingRef.current = false;
        }
      });

      // Start playing after buffering
      await newSound.playAsync();
    } catch (error) {
      // Optionally alert user here
      // alert("تعذر تشغيل الصوت. حاول مرة أخرى.");
      setSound(null);
      setPlayingZekrId(null);
      isAudioPlayingRef.current = false;
    } finally {
      setBufferingZekrId(null);
    }
  };

  const handleStartCounting = async (zekrID) => {
    const newCount = (counts[zekrID] || 0) + 1;
    setCounts((prev) => ({
      ...prev,
      [zekrID]: newCount,
    }));
    await saveCount(zekrID, newCount);
  };

  const handleResetCounting = async (zekrID) => {
    setCounts((prev) => ({
      ...prev,
      [zekrID]: 0,
    }));
    await resetCount(zekrID);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.highlight} />
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
        data={categoryData.items}
        keyExtractor={(item) => item.zekrID.toString()}
        renderItem={({ item }) => {
          const currentCount = counts[item.zekrID] || 0;

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: currentColors.cardBackground,
                  shadowColor: currentColors.text,
                },
              ]}
            >
              <Text style={[styles.content, { color: currentColors.text }]}>
                {item.content}
              </Text>

              <View style={styles.footer}>
                <Text style={[styles.count, { color: Colors.highlight }]}>
                  ×{toArabicNumber(item.count)}
                </Text>

                <View style={styles.counterSection}>
                  <TouchableOpacity
                    onPress={() => handleStartCounting(item.zekrID)}
                    style={[
                      styles.startCountingButton,
                      { backgroundColor: Colors.highlight, minWidth: 100},
                    ]}
                  >
                    <Text style={styles.buttonText}>
                      {currentCount === 0
                        ? "ابدأ العد"
                        : `${toArabicNumber(currentCount)}`}
                    </Text>
                  </TouchableOpacity>

                  {currentCount > 0 && (
                    <TouchableOpacity
                      onPress={() => handleResetCounting(item.zekrID)}
                      style={[
                        styles.counterButton,
                        { backgroundColor: "#ff4d4d" },
                      ]}
                    >
                      <Text style={styles.buttonText}>إعادة</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {item.audio && (
                  <TouchableOpacity
                    onPress={() => handleToggleAudio(item)}
                    style={styles.playButton}
                    disabled={!!bufferingZekrId}
                  >
                    {/* Buffering indicator */}
                    {bufferingZekrId === item.zekrID ? (
                      <ActivityIndicator size={28} color={Colors.highlight} />
                    ) : (
                      <Ionicons
                        name={
                          playingZekrId === item.zekrID
                            ? "close-circle"
                            : "play-circle"
                        }
                        size={28}
                        color={Colors.highlight}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AzkarDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 1 },
    marginHorizontal: 5,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  content: {
    fontSize: 20,
    fontFamily: "digitalkhatt",
    lineHeight: 30,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  count: {
    fontSize: 18,
  },
  playButton: {
    paddingLeft: 12,
    minWidth: 36, // ensures space for spinner and icon
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  counterSection: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
    minWidth: 30,
  },
  startCountingButton: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  counterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
