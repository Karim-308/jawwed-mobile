import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
  TextInput,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useSelector, useDispatch } from "react-redux";
import { fetchPageData, setPageNumber } from "../../../redux/actions/pageActions";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioRecord from "react-native-audio-record";
import { Buffer } from "buffer";
import GraphemeSplitter from "grapheme-splitter";

const SAMPLE_RATE = 16000;
const splitter = new GraphemeSplitter();
const BASMALLAH = "بسم الله الرحمن الرحيم";
const QURAN_SYMBOL_REGEX = /^[۞۩۝ۣۗۘۙۚۛۜۢۤۥۦ۪ۭۧۨ۫۬ۮۯ۰۱ۺۻۼ۽۾ۿ]+$/;

const highlightStyles = {
  green:  { bg: "#44e27d", color: "#13351f" },
  yellow: { bg: "#ffe04c", color: "#473a00" },
  orange: { bg: "#ffb44c", color: "#523700" },
  red:    { bg: "#ff5252", color: "#fff" },
  gray:   { bg: "#222", color: "#aaa" },
};

function removeTashkeel(str = "") {
  return str.replace(/[\u064B-\u065F\u0670-\u06ED\u0610-\u061A\u08CA-\u08FF]/g, "").replace(/[ـ]/g, "");
}
function normalizeArabic(str = "") {
  return removeTashkeel(str)
    .replace(/[\u200C-\u200F\u202A-\u202E\u2066-\u2069\u200B]/g, "")         // Remove invisible/zero-width chars
    .replace(/ٱ/g, "ا")
    .replace(/[إأآااُاِاَ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "ء")
    .replace(/ئ/g, "ء")
    .replace(/ة/g, "ه")
    .replace(/[ڕڑ]/g, "ر")
    .replace(/[\u06D6-\u06ED]/g, "")                                         // Remove Quran annotation marks
    .replace(/[\u0640]/g, "")                                                // Remove tatweel
    .replace(/[^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z0-9\s]/g, "")
    .trim();
}


function isBasmallahLine(text) {
  const norm = (text || "").replace(/\s+/g, "");
  return norm === BASMALLAH.replace(/\s+/g, "");
}

const TasmeeMainScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, pageNumber } = useSelector((state) => state.page);
  const linesData = useSelector((state) => state.page?.data?.[pageNumber]);
  const { width } = useWindowDimensions();
  const containerWidth = useMemo(() => width * 0.93, [width]);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [micPermissionGranted, setMicPermissionGranted] = useState(Platform.OS === "ios");
  const wsRef = useRef(null);
  const bufferRef = useRef([]);

  // Dynamic config
  const [wsUrl, setWsUrl] = useState("");
  const [chunkDuration, setChunkDuration] = useState("");
  const [configSubmitted, setConfigSubmitted] = useState(false);

  // Page navigation
  const onSwipe = useCallback((direction) => {
    if (!pageNumber) return;
    const current = Number(pageNumber);
    if (direction === "SWIPE_LEFT" && current > 1) dispatch(setPageNumber(current - 1));
    else if (direction === "SWIPE_RIGHT" && current < 604) dispatch(setPageNumber(current + 1));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (pageNumber) dispatch(fetchPageData(pageNumber));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: "Microphone Permission",
        message: "We need access to your microphone to record audio.",
        buttonPositive: "OK",
      }).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) setMicPermissionGranted(true);
        else Alert.alert("Permission Denied", "Microphone access is required to record audio.");
      });
    }
  }, []);

  // --- Highlight Logic: Only surah name is skipped, basmallah is included! ---
  useEffect(() => {
    if (!linesData) return;
    const firstLineWords = linesData[0]?.text?.trim().split(/\s+/).filter(Boolean) || [];
    const isFirstLineSurahName = firstLineWords.length === 1;
    let skipWordsCount = 0;
    if (isFirstLineSurahName) skipWordsCount += 1;
    // Basmalah is *not* skipped, included in calculation.

    const allWords = linesData.flatMap(line =>
      line.text.split(" ").filter(Boolean)
    );
    const quranText = allWords.filter((w, i) =>
      i >= skipWordsCount && w &&
      !/^[\d\u0660-\u0669]+$/.test(w) &&
      !QURAN_SYMBOL_REGEX.test(w)
    );
    if (!transcript.trim()) {
      setHighlightedWords(Array(quranText.length).fill("gray"));
      return;
    }
    const spokenWords = transcript
      .trim()
      .split(" ")
      .map((w) => (w || "").trim().normalize("NFC"))
      .filter(Boolean);
    const highlights = quranText.map((qWord) => {
      let best = "gray";
      const qNorm = normalizeArabic(qWord);
      for (let tIdx = 0; tIdx < spokenWords.length; tIdx++) {
        const sWord = spokenWords[tIdx];
        const sNorm = normalizeArabic(sWord);
        if (qWord === sWord) { best = "green"; break; }
        if (qNorm === sNorm) {
          const qArr = Array.from(qWord);
          const sArr = Array.from(sWord);
          let matched = 0, checked = 0;
          for (let i = 0, j = 0; i < qArr.length && j < sArr.length; ) {
            if (normalizeArabic(qArr[i]) === normalizeArabic(sArr[j])) {
              checked++; if (qArr[i] === sArr[j]) matched++; i++; j++;
            } else { i++; j++; }
          }
          let percent = checked ? (matched / checked) : 0;
          if (percent >= 0.8 && percent < 1) best = "yellow";
          else if (percent > 0 && percent < 0.8) best = "orange";
        }
      }
      return best;
    });
    setHighlightedWords(highlights);
  }, [transcript, linesData]);

  useEffect(() => {
    setTranscript("");
    setHighlightedWords([]);
    stopRecording();
    bufferRef.current = [];
  }, [pageNumber]);

  // Audio/WebSocket logic
  const connectWebSocket = () => {
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => { wsRef.current = ws; };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const text = msg.transcription || msg.text || e.data;
        setTranscript((prev) => prev + text + " ");
      } catch {
        setTranscript((prev) => prev + e.data + " ");
      }
    };
    ws.onerror = () => { stopRecording(); };
    ws.onclose = () => { stopRecording(); };
  };

  const startRecording = () => {
    if (!micPermissionGranted) {
      Alert.alert("Permission Required", "Microphone access is required.");
      return;
    }
    connectWebSocket();
    bufferRef.current = [];
    setTranscript("");
    setRecording(true);
    AudioRecord.init({
      sampleRate: SAMPLE_RATE,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: "live.wav",
    });
    AudioRecord.start();
    AudioRecord.on("data", (data) => {
      const CHUNK_SIZE = (SAMPLE_RATE * Number(chunkDuration || 10000)) / 1000;
      const pcm = Buffer.from(data, "base64");
      bufferRef.current.push(pcm);
      const totalLength = bufferRef.current.reduce((sum, chunk) => sum + chunk.length, 0);
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
    try { AudioRecord.stop(); } catch {}
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
  };

  const encodeWAV = (pcmData) => {
    const buffer = new ArrayBuffer(44 + pcmData.length);
    const view = new DataView(buffer);
    const writeString = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
    writeString(0, "RIFF"); view.setUint32(4, 36 + pcmData.length, true); writeString(8, "WAVE");
    writeString(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, SAMPLE_RATE, true); view.setUint32(28, SAMPLE_RATE * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    writeString(36, "data"); view.setUint32(40, pcmData.length, true);
    const wavBuffer = new Uint8Array(buffer); wavBuffer.set(pcmData, 44); return wavBuffer;
  };

  // Input validation
  const wsUrlValid = wsUrl.startsWith("ws://") || wsUrl.startsWith("wss://");
  const chunkValid = !!chunkDuration && !isNaN(chunkDuration) && Number(chunkDuration) > 0;
  const canSubmitConfig = wsUrlValid && chunkValid && !recording;

  // Render Quran lines
  const renderLines = () => {
    if (loading) return <ActivityIndicator size="large" color="#FFD700" />;
    if (error) return <Text style={styles.errorText}>خطأ في تحميل الصفحة</Text>;
    if (!linesData) return null;
    const firstLineWords = linesData[0]?.text?.trim().split(/\s+/).filter(Boolean) || [];
    const isFirstLineSurahName = firstLineWords.length === 1;
    let runningIndex = 0;
    return linesData.map((line, idx) => {
      if (idx === 0 && isFirstLineSurahName) {
        return (
          <View key={idx} style={styles.lineWrapper}>
            <Text style={[styles.ayahText, styles.surahNameText, { fontSize: containerWidth * 0.058 }]}>{line.text.trim()}</Text>
          </View>
        );
      }
      // basmallah is treated as normal line and will be highlighted as part of calculation
      const words = line.text.split(" ").filter(Boolean);
      return (
        <View key={idx} style={styles.lineWrapper}>
          {words.map((word, i) => {
            if (QURAN_SYMBOL_REGEX.test(word)) return null;
            if (/^[\d\u0660-\u0669]+$/.test(word)) {
              return (
                <Text key={i} style={styles.ayahNumberText}>
                  {word}
                </Text>
              );
            }
            let highlight = highlightedWords[runningIndex++] || "gray";
            let styleSet = highlightStyles[highlight] || highlightStyles.gray;
            // Basmallah line: optional color override for pretty look
            let customColor = (isBasmallahLine(line.text)) ? "#59d98d" : styleSet.color;
            let customBg = (isBasmallahLine(line.text)) ? "#203f2e" : styleSet.bg;
            return (
              <Text
                key={i}
                style={[
                  styles.ayahText,
                  {
                    backgroundColor: customBg,
                    borderRadius: 18,
                    margin: 4,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    fontSize: containerWidth * 0.052,
                    color: customColor,
                    fontWeight: "600",
                  },
                ]}
              >
                {word}
              </Text>
            );
          })}
        </View>
      );
    });
  };

  // UI for dynamic config
  const renderConfigInputs = () => (
    <View style={styles.configForm}>
      <Text style={styles.configLabel}>WebSocket URL</Text>
      <TextInput
        style={[
          styles.inputBox,
          wsUrlValid ? styles.inputBoxValid : wsUrl ? styles.inputBoxInvalid : null,
        ]}
        value={wsUrl}
        placeholder="ws://example.com/ws/mp3"
        onChangeText={setWsUrl}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#666"
        editable={!configSubmitted && !recording}
      />
      <Text style={styles.configLabel}>مدة كل جزء (ms)</Text>
      <TextInput
        style={[
          styles.inputBox,
          chunkValid ? styles.inputBoxValid : chunkDuration ? styles.inputBoxInvalid : null,
        ]}
        value={chunkDuration}
        placeholder="10000"
        onChangeText={setChunkDuration}
        keyboardType="numeric"
        editable={!configSubmitted && !recording}
      />
      <TouchableOpacity
        style={[
          styles.configButton,
          canSubmitConfig ? null : styles.configButtonDisabled,
        ]}
        onPress={() => setConfigSubmitted(true)}
        disabled={!canSubmitConfig}
      >
        <Text style={styles.configButtonText}>تأكيد الإعدادات</Text>
      </TouchableOpacity>
    </View>
  );

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
      <View style={styles.bottomArea}>
        {!configSubmitted ? (
          renderConfigInputs()
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.recordButton,
                { backgroundColor: recording ? "#FFD900" : "#FFD700", opacity: recording ? 0.75 : 1 },
              ]}
              onPress={recording ? stopRecording : startRecording}
              activeOpacity={0.75}
            >
              <Text style={styles.recordButtonText}>{recording ? "إيقاف التسجيل" : "بدء التسجيل"}</Text>
            </TouchableOpacity>
            <ScrollView style={styles.transcriptScroll}>
              <Text style={styles.transcript}>{transcript.trim()}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.configResetButton}
              onPress={() => {
                setConfigSubmitted(false);
                setRecording(false);
                setTranscript("");
                wsRef.current = null;
              }}
            >
              <Text style={styles.configResetText}>تعديل الإعدادات</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TasmeeMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 0,
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
    backgroundColor: "transparent",
    color: "#FFD700",
    fontWeight: "bold",
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 8,
    fontSize: 28,
    letterSpacing: 1,
  },
  basmallahText: {
    backgroundColor: "transparent",
    color: "#59d98d",
    fontWeight: "700",
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  ayahNumberText: {
    color: "#FFD700",
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 7,
    marginHorizontal: 2,
    fontSize: 19,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
  bottomArea: {
    padding: 18,
    backgroundColor: "#181818",
    borderTopWidth: 1,
    borderColor: "#191919",
    alignItems: "center",
  },
  recordButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 5,
  },
  recordButtonText: {
    color: "#2d1c02",
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 1,
    textShadowColor: "#fff2",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  transcriptScroll: {
    width: "100%",
    maxHeight: 120,
    backgroundColor: "#191919",
    borderRadius: 11,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  transcript: {
    fontSize: 16,
    color: "#FFD700",
    fontFamily: Platform.OS === "ios" ? "Geeza Pro" : "sans-serif",
    lineHeight: 28,
    fontWeight: "500",
    textAlign: "right",
  },
  errorText: {
    color: "#FF6767",
    textAlign: "center",
    marginVertical: 10,
  },
  // --- Dynamic config UI styles
  configForm: {
    width: "100%",
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: "#171717",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#FFD70044",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  configLabel: {
    color: "#FFD700",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "right",
    fontSize: 16,
  },
  inputBox: {
    backgroundColor: "#232323",
    borderRadius: 8,
    color: "#FFD700",
    fontWeight: "500",
    fontSize: 15,
    paddingVertical: 9,
    paddingHorizontal: 13,
    marginBottom: 7,
    borderWidth: 2,
    borderColor: "#333",
    textAlign: "right",
  },
  inputBoxValid: {
    borderColor: "#44e27d",
  },
  inputBoxInvalid: {
    borderColor: "#ff5252",
  },
  configButton: {
    width: "100%",
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
    elevation: 2,
  },
  configButtonDisabled: {
    backgroundColor: "#b1a055",
    opacity: 0.7,
  },
  configButtonText: {
    color: "#2d1c02",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  configResetButton: {
    marginTop: 10,
    alignSelf: "center",
    padding: 7,
  },
  configResetText: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
