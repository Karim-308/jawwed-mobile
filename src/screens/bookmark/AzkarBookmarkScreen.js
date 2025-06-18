import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Vibration,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Colors from "../../constants/newColors";
import getBookmarks from "../../api/bookmark/GetBookmark";
import deleteBookmark from "../../api/bookmark/DeleteBookmark";
import {
  getAllAzkarCounts,
  saveAzkarCount,
  resetAzkarCount,
} from "../../utils/database/countsRepository";
import { toArabicNumber } from "../../utils/format";
import { useFocusEffect } from "@react-navigation/native";
import BookmarkListHeader from "./components/BookmarkHeader";

const AzkarBookmarkScreen = ({ darkMode, focused, isTabActive }) => {
  const [bookmarkedAzkar, setBookmarkedAzkar] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [playingZekrId, setPlayingZekrId] = useState(null);
  const [bufferingZekrId, setBufferingZekrId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pressedZekrId, setPressedZekrId] = useState(null);

  const currentColors = darkMode ? Colors.dark : Colors.light;

  const stopAndUnloadSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch {}
      setSound(null);
      setPlayingZekrId(null);
    }
  };

  useEffect(() => {
    if (!focused || !isTabActive) {
      stopAndUnloadSound();
    }
  }, [focused, isTabActive]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allBookmarks = await getBookmarks();
        const filtered = allBookmarks.filter(
          (b) => b.bookmarkType === 1 && b.zekr && b.zekr.zekrID
        );
        setBookmarkedAzkar(filtered);
        await getAllAzkarCounts((loadedCounts) => setCounts(loadedCounts));
      } catch (e) {
        console.error("Error fetching bookmarks/counts:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteBookmark = async (zekrID) => {
    try {
      await deleteBookmark({ identifier: zekrID, type: 1 });
      setBookmarkedAzkar((prev) =>
        prev.filter((item) => item.zekr.zekrID !== zekrID)
      );
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const allBookmarks = await getBookmarks();
      const filtered = allBookmarks.filter(
        (b) => b.bookmarkType === 1 && b.zekr && b.zekr.zekrID
      );
      setBookmarkedAzkar(filtered);
      await getAllAzkarCounts((loadedCounts) => setCounts(loadedCounts));
    } catch (e) {
      console.error("Error refreshing bookmarks/counts:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartCounting = async (zekrID) => {
    Vibration.vibrate(50);
    const newCount = (counts[zekrID] || 0) + 1;
    setCounts((prev) => ({ ...prev, [zekrID]: newCount }));
    await saveAzkarCount(zekrID, newCount);
  };

  const handleResetCounting = async (zekrID) => {
    setCounts((prev) => ({ ...prev, [zekrID]: 0 }));
    await resetAzkarCount(zekrID);
  };

  const handleToggleAudio = async (zekr) => {
    if (bufferingZekrId) return;

    if (playingZekrId === zekr.zekrID && sound) {
      await stopAndUnloadSound();
      return;
    }

    await stopAndUnloadSound();

    setBufferingZekrId(zekr.zekrID);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: zekr.audio },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingZekrId(zekr.zekrID);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingZekrId(null);
        }
      });
    } catch (error) {
      console.error("Audio error:", error);
    } finally {
      setBufferingZekrId(null);
    }
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
        data={bookmarkedAzkar}
        keyExtractor={(item) => `azkar-${item.zekr.zekrID}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.highlight}
              style={{ marginTop: 40 }}
            />
          ) : (
            <Text
              style={{
                color: currentColors.text,
                textAlign: "center",
                marginTop: 40,
              }}
            >
              لا توجد إشارات مرجعية حتى الآن
            </Text>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.highlight]}
            progressBackgroundColor={currentColors.background}
          />
        }
        ListHeaderComponent={
          <BookmarkListHeader title="الأذكار" darkMode={darkMode} />
        }
        renderItem={({ item }) => {
          const zekr = item.zekr;
          const currentCount = counts[zekr.zekrID] || 0;

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
                onPress={() => handleStartCounting(zekr.zekrID)}
                onPressIn={() => setPressedZekrId(zekr.zekrID)}
                onPressOut={() => setPressedZekrId(null)}
                style={[
                  styles.countableTouchable,
                  {
                    backgroundColor:
                      pressedZekrId === zekr.zekrID
                        ? Colors.highlight // gold highlight
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
                        pressedZekrId === zekr.zekrID
                          ? "#fff" // make text white when pressed
                          : currentColors.text,
                    },
                  ]}
                >
                  {zekr.content}
                </Text>

                {zekr.category && (
                  <Text style={[styles.category, { color: Colors.highlight }]}>
                    {zekr.category}
                  </Text>
                )}
              </Pressable>

              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: darkMode ? "#e0e0e0" : "#000",
                    opacity: darkMode ? 0.18 : 0.3,
                  },
                ]}
              />
              <View style={styles.footer}>
                <Text style={[styles.count, { color: Colors.highlight }]}>
                  {" "}
                  ×{toArabicNumber(zekr.count)}{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteBookmark(zekr.zekrID)}
                  style={[styles.counterButton, { backgroundColor: "#ff4d4d" }]}
                >
                  <Text style={styles.buttonText}>إلغاء</Text>
                </TouchableOpacity>
                <View
                  style={[
                    styles.counterSection,
                    {
                      borderColor: darkMode
                        ? "rgba(224, 224, 224, 0.2)"
                        : "rgba(0, 0, 0, 0.3)",
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleStartCounting(zekr.zekrID)}
                    style={[
                      styles.startCountingButton,
                      { backgroundColor: Colors.highlight },
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
                      onPress={() => handleResetCounting(zekr.zekrID)}
                      style={[
                        styles.counterButton,
                        { backgroundColor: "#ff4d4d" },
                      ]}
                    >
                      <Ionicons name="refresh" size={20} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
                {zekr.audio && (
                  <TouchableOpacity
                    onPress={() => handleToggleAudio(zekr)}
                    style={styles.playButton}
                    disabled={!!bufferingZekrId}
                  >
                    {bufferingZekrId === zekr.zekrID ? (
                      <ActivityIndicator size={28} color={Colors.highlight} />
                    ) : (
                      <Ionicons
                        name={
                          playingZekrId === zekr.zekrID
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
      />
    </View>
  );
};

export default AzkarBookmarkScreen;

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
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  content: {
    fontSize: 20,
    fontFamily: "digitalkhatt",
    lineHeight: 30,
    textAlign: "right",
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 6,
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
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  counterSection: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 6,
    marginTop: 8,
    minWidth: 30,
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: "solid",
  },
  startCountingButton: {
    alignItems: "center",
    paddingVertical: 6,
    minWidth: 100,
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
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 6,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  countableTouchable: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
});
