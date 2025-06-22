import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useSelector, useDispatch } from "react-redux";
import { fetchPageData, setPageNumber } from "../../../redux/actions/pageActions";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioRecord from "react-native-audio-record";
import { Buffer } from "buffer";

// --- Helper regex ---
const TASHKEEL_REGEX = /[\u064B-\u0652\u0670\u06D6-\u06ED]/g;
const REMOVE_TASHKEEL = (str) => str.replace(TASHKEEL_REGEX, "");
const EXTRACT_TASHKEEL = (str) => (str.match(TASHKEEL_REGEX) || []).join("");

const SAMPLE_RATE = 16000;
const CHUNK_DURATION_MS = 10000;
const HARDCODED_WS_URL = "wss://eaa0-197-57-234-162.ngrok-free.app/ws/mp3";
const CHUNK_SIZE = (SAMPLE_RATE * CHUNK_DURATION_MS) / 1000;

const normalizeWord = (str) =>
  (str || "").trim().normalize("NFC").replace(/\u200c|\u200d/g, ""); // Remove ZWNJ/ZWJ too

const TasmeeMainScreen = ({ route }) => {
  const dispatch = useDispatch();
  const routePageNumber = route?.params?.pageNumber || 1;
  const { loading, error, pageNumber } = useSelector((state) => state.page);
  const linesData = useSelector((state) => state.page?.data?.[pageNumber]);
  const { width } = useWindowDimensions();
  const containerWidth = useMemo(() => width * 0.9, [width]);

  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [micPermissionGranted, setMicPermissionGranted] = useState(
    Platform.OS === "ios"
  );

  const wsRef = useRef(null);
  const bufferRef = useRef([]);

  // Swipe gesture handler
  const onSwipe = useCallback(
    (direction) => {
      if (!pageNumber) return;
      const current = Number(pageNumber);
      if (direction === "SWIPE_LEFT" && current > 1) {
        dispatch(setPageNumber(current - 1));
        dispatch(fetchPageData(current - 1));
        console.log("[SWIPE] Left: Go to page", current - 1);
      } else if (direction === "SWIPE_RIGHT" && current < 604) {
        dispatch(setPageNumber(current + 1));
        dispatch(fetchPageData(current + 1));
        console.log("[SWIPE] Right: Go to page", current + 1);
      }
    },
    [dispatch, pageNumber]
  );

  useEffect(() => {
    dispatch(setPageNumber(routePageNumber));
    dispatch(fetchPageData(routePageNumber));
  }, [dispatch, routePageNumber]);

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: "Microphone Permission",
        message: "We need access to your microphone to record audio.",
        buttonPositive: "OK",
      }).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setMicPermissionGranted(true);
        } else {
          Alert.alert(
            "Permission Denied",
            "Microphone access is required to record audio."
          );
        }
      });
    }
  }, []);

  // --- Highlighting & Comparison Logic ---
  useEffect(() => {
    if (!linesData) return;

    const allWords = linesData.flatMap((line) => line.text.split(" "));
    const quranText = allWords
      .map((w) => normalizeWord(w))
      .filter((w) => w && !/^[\d\u0660-\u0669]+$/.test(w));

    const spokenWords = transcript
      .trim()
      .split(" ")
      .map((w) => normalizeWord(w))
      .filter(Boolean);

    console.log("==== Quran text extraction ====");
    console.log("All Quran words:", quranText);
    console.log("Spoken words:", spokenWords);

    // For each spoken word, log code points
    spokenWords.forEach((w, idx) =>
      console.log(
        `Spoken[${idx}]: "${w}" codepoints:`,
        [...w].map((c) => c.charCodeAt(0))
      )
    );
    quranText.forEach((w, idx) =>
      console.log(
        `Quran[${idx}]: "${w}" codepoints:`,
        [...w].map((c) => c.charCodeAt(0))
      )
    );

    const used = Array(spokenWords.length).fill(false);

    function countTashkeelOverlap(t1, t2) {
      let count = 0;
      for (let i = 0; i < t1.length; i++) {
        if (t2.includes(t1[i])) count++;
      }
      return count;
    }

    const highlights = quranText.map((qWord, i) => {
      let bestIdx = -1;
      let bestColor = "red";
      let bestScore = 0;

      const qNoTashkeel = REMOVE_TASHKEEL(qWord);
      const qTashkeel = EXTRACT_TASHKEEL(qWord);

      for (let j = 0; j < spokenWords.length; j++) {
        if (used[j]) continue;
        const sWord = spokenWords[j];
        const sNoTashkeel = REMOVE_TASHKEEL(sWord);
        const sTashkeel = EXTRACT_TASHKEEL(sWord);

        // Debug print before matching
        console.log(
          `[${i}:${j}]`,
          `Q: "${qWord}" [${[...qWord].map((c) => c.charCodeAt(0))}]`,
          `S: "${sWord}" [${[...sWord].map((c) => c.charCodeAt(0))}]`
        );

        // Normalize and compare exact with tashkeel
        if (qWord === sWord) {
          bestIdx = j;
          bestColor = "green";
          bestScore = 3;
          console.log(`Matched GREEN (full): ${qWord} === ${sWord}`);
          break;
        }

        // Both stripped (no tashkeel), and some tashkeel overlap
        if (
          qNoTashkeel === sNoTashkeel &&
          qTashkeel &&
          sTashkeel &&
          countTashkeelOverlap(qTashkeel, sTashkeel) > 0 &&
          bestScore < 2
        ) {
          bestIdx = j;
          bestColor = "yellow";
          bestScore = 2;
          console.log(
            `Matched YELLOW (tashkeel overlap): ${qNoTashkeel} === ${sNoTashkeel}, tashkeel: ${qTashkeel} & ${sTashkeel}`
          );
        } else if (qNoTashkeel === sNoTashkeel && bestScore < 1) {
          bestIdx = j;
          bestColor = "orange";
          bestScore = 1;
          console.log(
            `Matched ORANGE (no tashkeel): ${qNoTashkeel} === ${sNoTashkeel}`
          );
        }
      }
      if (bestIdx !== -1) used[bestIdx] = true;
      const matched = bestIdx !== -1 ? spokenWords[bestIdx] : "";

      if (bestColor === "red") {
        // If it's red, show why
        console.log(
          `NO MATCH: Quran "${qWord}" [${[...qWord].map((c) =>
            c.charCodeAt(0)
          )}], No equivalent in transcript`
        );
      }
      return bestColor;
    });

    setHighlightedWords(highlights);
    console.log("Highlight colors:", highlights);
    console.log(
      "HIGHLIGHTS length:",
      highlights.length,
      "| Quran words:",
      quranText.length
    );
  }, [transcript, linesData]);

  // --- Recording Logic ---
  const connectWebSocket = () => {
    const ws = new WebSocket(HARDCODED_WS_URL);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      wsRef.current = ws;
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const text = msg.transcription || msg.text || e.data;
        setTranscript((prev) => prev + text + " ");
      } catch {
        setTranscript((prev) => prev + e.data + " ");
      }
    };
    ws.onerror = (e) => {
      stopRecording();
    };
    ws.onclose = () => {
      stopRecording();
    };
  };

  const startRecording = () => {
    if (!micPermissionGranted) {
      Alert.alert("Permission Required", "Microphone access is required.");
      return;
    }
    AudioRecord.init({
      sampleRate: SAMPLE_RATE,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: "live.wav",
    });
    connectWebSocket();
    bufferRef.current = [];
    setTranscript("");
    setRecording(true);
    AudioRecord.start();
    AudioRecord.on("data", (data) => {
      const pcm = Buffer.from(data, "base64");
      bufferRef.current.push(pcm);
      const totalLength = bufferRef.current.reduce(
        (sum, chunk) => sum + chunk.length,
        0
      );
      if (totalLength >= CHUNK_SIZE * 2) {
        const chunk = Buffer.concat(bufferRef.current);
        bufferRef.current = [];
        const wav = encodeWAV(chunk);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(wav);
        }
      }
    });
  };

  const stopRecording = () => {
    setRecording(false);
    AudioRecord.stop();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
  };

  const encodeWAV = (pcmData) => {
    const buffer = new ArrayBuffer(44 + pcmData.length);
    const view = new DataView(buffer);
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, SAMPLE_RATE, true);
    view.setUint32(28, SAMPLE_RATE * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, pcmData.length, true);
    const wavBuffer = new Uint8Array(buffer);
    wavBuffer.set(pcmData, 44);
    return wavBuffer;
  };

  // --- Render UI ---
  const renderLines = () => {
    if (loading) return <ActivityIndicator size="large" color="#EFB975" />;
    if (error) return <Text style={styles.errorText}>خطأ في تحميل الصفحة</Text>;
    if (!linesData) return null;
    let runningIndex = 0;

    return linesData.map((line, idx) => {
      const words = line.text.split(" ");
      return (
        <View key={idx} style={styles.lineWrapper}>
          {line.lineType === "surah_name" ? (
            <Text style={[styles.ayahText, styles.surahNameText]}>
              سُورَةُ {line.text}
            </Text>
          ) : line.lineType === "basmallah" ? (
            words.map((word, i) => {
              if (/^[\d\u0660-\u0669]+$/.test(word)) {
                return (
                  <Text key={i} style={[styles.ayahText]}>
                    {word}
                  </Text>
                );
              }
              const highlight = highlightedWords[runningIndex++];
              const bg =
                highlight === "green"
                  ? "#c8f7c5"
                  : highlight === "yellow"
                  ? "#fff3b0"
                  : highlight === "orange"
                  ? "#ffd8a6"
                  : highlight === "red"
                  ? "#f7c5c5"
                  : "transparent";
              return (
                <Text
                  key={i}
                  style={[
                    styles.ayahText,
                    {
                      backgroundColor: bg,
                      borderRadius: 18,
                      borderWidth: highlight === "red" ? 2 : 0,
                      borderColor:
                        highlight === "red" ? "#e57373" : "transparent",
                      margin: 4,
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      fontSize: containerWidth * 0.052,
                    },
                  ]}
                >
                  {word}
                </Text>
              );
            })
          ) : (
            words.map((word, i) => {
              if (/^[\d\u0660-\u0669]+$/.test(word)) {
                return (
                  <Text key={i} style={[styles.ayahText]}>
                    {word}
                  </Text>
                );
              }
              const highlight = highlightedWords[runningIndex++];
              const bg =
                highlight === "green"
                  ? "#c8f7c5"
                  : highlight === "yellow"
                  ? "#fff3b0"
                  : highlight === "orange"
                  ? "#ffd8a6"
                  : highlight === "red"
                  ? "#f7c5c5"
                  : "transparent";
              return (
                <Text
                  key={i}
                  style={[
                    styles.ayahText,
                    {
                      backgroundColor: bg,
                      borderRadius: 18,
                      borderWidth: highlight === "red" ? 2 : 0,
                      borderColor:
                        highlight === "red" ? "#e57373" : "transparent",
                      margin: 4,
                      fontSize: containerWidth * 0.052,
                    },
                  ]}
                >
                  {word}
                </Text>
              );
            })
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureRecognizer
        onSwipeLeft={() => onSwipe("SWIPE_LEFT")}
        onSwipeRight={() => onSwipe("SWIPE_RIGHT")}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {renderLines()}
        </ScrollView>
      </GestureRecognizer>
      <View style={styles.controls}>
        <Button
          title={recording ? "إيقاف التسجيل" : "بدء التسجيل"}
          onPress={recording ? stopRecording : startRecording}
          color={recording ? "red" : "green"}
        />
        <ScrollView style={styles.transcriptScroll}>
          <Text style={styles.transcript}>{transcript}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TasmeeMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  lineWrapper: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 4,
  },
  ayahText: {
    fontFamily: "UthmanicHafs",
    fontSize: 16,
    color: "white",
    marginHorizontal: 3,
    textAlign: "center",
  },
  surahNameText: {
    color: "#EFB975",
    fontSize: 26,
    textAlign: "center",
    width: "100%",
    marginBottom: 16,
    letterSpacing: 2,
  },
  controls: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  transcriptScroll: {
    marginTop: 10,
    maxHeight: 110,
  },
  transcript: {
    fontSize: 16,
    color: "#333",
    lineHeight: 29,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});
