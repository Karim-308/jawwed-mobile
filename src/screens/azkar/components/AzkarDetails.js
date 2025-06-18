import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  Vibration,
  Pressable,
} from "react-native";
import { getAzkarWithID } from "../../../api/azkar/getAzkarWithID";
import { toArabicNumber } from "../../../utils/format";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { get } from "../../../utils/localStorage/secureStore";
import Colors from "../../../constants/newColors";
import {
  getAllAzkarCounts,
  saveAzkarCount,
  resetAzkarCount,
} from "../../../utils/database/countsRepository";
import postBookmark from "../../../api/bookmark/PostBookmark";
import getBookmarks from "../../../api/bookmark/GetBookmark";
import deleteBookmark from "../../../api/bookmark/DeleteBookmark";

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
  const [bookmarkedZekrIDs, setBookmarkedZekrIDs] = useState([]);
  const [pressedZekrId, setPressedZekrId] = useState(null);

  useEffect(() => {
    (async () => {
      await fetchCategory();
      await fetchCounts();
      await fetchBookmarkedZekrIDs();
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
    await getAllAzkarCounts((loadedCounts) => {
      setCounts(loadedCounts);
    });
  };

  const handleBookmark = async (zekrID) => {
    const idStr = zekrID.toString();
    const isBookmarked = bookmarkedZekrIDs.includes(idStr);

    try {
      if (isBookmarked) {
        // Unbookmark logic (you need to implement deleteBookmark API)
        await deleteBookmark({ identifier: idStr, type: 1 });
      } else {
        await postBookmark({ bookmarkType: 1, zekrID: idStr });
      }

      // Refresh bookmarks after any change
      await fetchBookmarkedZekrIDs();
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  const fetchBookmarkedZekrIDs = async () => {
    try {
      const allBookmarks = await getBookmarks();

      // Filter only zekr-type bookmarks
      const zekrBookmarks = allBookmarks.filter(
        (b) => b.bookmarkType === 1 && b.zekr && b.zekr.zekrID
      );

      // Extract IDs as strings
      const ids = zekrBookmarks.map((b) => b.zekr.zekrID.toString());

      setBookmarkedZekrIDs(ids);
    } catch (error) {
      console.error("Failed to load bookmarked azkar:", error);
    }
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
      // Refetch bookmarks every time the screen comes into focus
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
    Vibration.vibrate(50); // Short vibration feedback
    const newCount = (counts[zekrID] || 0) + 1;
    setCounts((prev) => ({
      ...prev,
      [zekrID]: newCount,
    }));
    await saveAzkarCount(zekrID, newCount);
  };

  const handleResetCounting = async (zekrID) => {
    setCounts((prev) => ({
      ...prev,
      [zekrID]: 0,
    }));
    await resetAzkarCount(zekrID);
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
      style={[styles.container, { backgroundColor: currentColors.background }]}
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
              <Pressable
                onPress={() => handleStartCounting(item.zekrID)}
                onPressIn={() => setPressedZekrId(item.zekrID)}
                onPressOut={() => setPressedZekrId(null)}
                style={[
                  styles.countableTouchable,
                  {
                    backgroundColor:
                      pressedZekrId === item.zekrID
                        ? Colors.highlight // gold during press
                        : darkMode
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.content,
                    {
                      color:
                        pressedZekrId === item.zekrID
                          ? "#fff"
                          : currentColors.text, // white text on gold
                    },
                  ]}
                >
                  {item.content}
                </Text>
              </Pressable>

              {/* footer section */}
              <View style={styles.footer}>
                <Text style={[styles.count, { color: Colors.highlight }]}>
                  ×{toArabicNumber(item.count)}
                </Text>

                <TouchableOpacity
                  onPress={() => handleBookmark(item.zekrID)}
                  style={styles.bookmarkButton}
                >
                  <Ionicons
                    name={
                      bookmarkedZekrIDs.includes(item.zekrID.toString())
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={24}
                    color={Colors.highlight}
                  />
                </TouchableOpacity>

                <View style={styles.counterSection}>
                  <TouchableOpacity
                    onPress={() => handleStartCounting(item.zekrID)}
                    style={[
                      styles.startCountingButton,
                      { backgroundColor: Colors.highlight, minWidth: 100 },
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
                      <Ionicons name="refresh" size={20} color="#fff" />
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
  bookmarkButton: {
    paddingLeft: 12,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  countableTouchable: {
  padding: 10,
  borderRadius: 10,
  marginBottom: 8,
},

});
