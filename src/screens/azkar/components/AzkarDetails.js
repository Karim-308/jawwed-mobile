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

I18nManager.forceRTL(true);

const AzkarDetails = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [playingZekrId, setPlayingZekrId] = useState(null);
  const isAudioPlayingRef = useRef(false); // flag to prevent overlapping playback
 
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getAzkarWithID(categoryId);
        setCategoryData(data);
  
        // Set header title dynamically
        navigation.setOptions({
          title: data.category,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategory();
  }, [categoryId]);
  
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused
      return () => {
        // Screen is unfocused — stop audio
        if (sound) {
          sound.stopAsync();
          sound.unloadAsync();
          setSound(null);
          setPlayingZekrId(null);
          isAudioPlayingRef.current = false;
        }
      };
    }, [sound])
  );

  const handleToggleAudio = async (item) => {
    try {
      // If user taps the currently playing one → stop it
      if (playingZekrId === item.zekrID) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setPlayingZekrId(null);
        isAudioPlayingRef.current = false;
        return;
      }

      // If some other audio is already playing, block this tap
      if (isAudioPlayingRef.current) {
        return;
      }

      // Otherwise, play new audio
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: item.audio });
      setSound(newSound);
      setPlayingZekrId(item.zekrID);
      isAudioPlayingRef.current = true;

      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingZekrId(null);
          isAudioPlayingRef.current = false;
        }
      });
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryData.items}
        keyExtractor={(item) => item.zekrID.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.footer}>
              <Text style={styles.count}>×{toArabicNumber(item.count)}</Text>
              {item.audio ? (
                <TouchableOpacity
                  onPress={() => handleToggleAudio(item)}
                  style={styles.playButton}
                >
                  <Ionicons
                    name={
                      playingZekrId === item.zekrID ? "close-circle" : "play-circle"
                    }
                    size={28}
                    color="#EFB975"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
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
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  content: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "digitalkhatt",
    lineHeight: 30,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  count: {
    fontSize: 18,
    color: "#EFB975",
  },
  playButton: {
    paddingLeft: 12,
  },
});
