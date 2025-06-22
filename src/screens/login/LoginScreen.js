import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { loginWithGoogleToken } from "../../api/auth/login/loginApi";
import { get, save } from "../../utils/localStorage/secureStore";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../redux/actions/authActions";
import { setDarkMode as setDarkModeRedux } from "../../redux/actions/themeActions";
import Colors from "../../constants/newColors";
import { StatusBar as RNStatusBar, Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(null);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // DARK MODE state (local and redux)
  const [darkMode, setDarkMode] = useState(false);
  const [darkModeReady, setDarkModeReady] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "17494011183-ahptm29eh4vek9jdgdrsskk5mu4bbieo.apps.googleusercontent.com",
    webClientId:
      "17494011183-fmimqr7mgrrfubd6vsmdbd7vuejsae2l.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
  });

  // --- Load dark mode before render ---
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const value = await get("darkMode");
        const dark = value === "true";
        setDarkMode(dark);
        dispatch(setDarkModeRedux(dark)); // <-- update Redux as well
      } catch {
        setDarkMode(false);
        dispatch(setDarkModeRedux(false)); // <-- fallback to false in Redux
      }
      setDarkModeReady(true);
    };
    loadDarkMode();
  }, []);

  // --- Login status check ---
  useEffect(() => {
    const checkLogin = async () => {
      const token = await get("userToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  // --- Navigate if already logged in ---
  useEffect(() => {
    if (isLoggedIn === true) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [isLoggedIn]);

  // --- Handle Google login response ---
  useEffect(() => {
    const handleLogin = async () => {
      if (response?.type === "success" && response.params?.id_token) {
        const idToken = response.params.id_token;
        setLoading(true);
        try {
          await loginWithGoogleToken(idToken);

          const name = await get("userName");
          const email = await get("userEmail");
          const token = await get("userToken");

          setUserInfo({ name, email });
          setJwtToken(token);
          dispatch(setLoggedIn());
          navigation.replace("Home");
        } catch (err) {
          console.error("❌ Login Error:", err);
          Alert.alert("خطأ في تسجيل الدخول", err.message || "حدث خطأ ما.");
          setLoading(false);
        }
      }
    };

    handleLogin();
  }, [response]);

  // --- Dark Mode Toggle ---
  const toggleDarkMode = async (value) => {
    await save("darkMode", value.toString());
    setDarkMode(value);
    dispatch(setDarkModeRedux(value)); // <-- update Redux on toggle
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  // --- Don't render until darkMode loaded ---
  if (!darkModeReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: "#000" }]}>
        <ActivityIndicator size="large" color={Colors.dark.underline} />
      </View>
    );
  }

  // --- Loading (login check or logging in) ---
  if (isLoggedIn === null || loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.loaderBackground },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.dark.underline} />
        <Text style={{ color: currentColors.loaderText, marginTop: 10 }}>
          {loading ? "جاري تسجيل الدخول..." : "جارٍ التحقق من الجلسة..."}
        </Text>
      </View>
    );
  }

  // --- Main login screen ---
  return (
    <>
      <View
        style={{
          height: Platform.OS === "android" ? 24 : 0,
          backgroundColor: "black",
        }}
      />

      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: currentColors.background,
            paddingTop:
              Platform.OS === "android" ? RNStatusBar.currentHeight || 24 : 0,
          },
        ]}
      >
        <Text style={[styles.title, { color: currentColors.text }]}>
          تسجيل الدخول
        </Text>
        <View style={[styles.underline, { backgroundColor: "#E0A500" }]} />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentColors.buttonBackground },
          ]}
          onPress={() => promptAsync()}
        >
          <Text style={[styles.buttonText, { color: currentColors.text }]}>
            المتابعة عبر جوجل
          </Text>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.googleIcon}
          />
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View
            style={[
              styles.separator,
              { backgroundColor: currentColors.separator },
            ]}
          />
          <Text style={[styles.orText, { color: currentColors.text }]}>أو</Text>
          <View
            style={[
              styles.separator,
              { backgroundColor: currentColors.separator },
            ]}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentColors.buttonBackground },
          ]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={[styles.buttonText, { color: currentColors.text }]}>
            المتابعة كزائر
          </Text>
        </TouchableOpacity>

        {/* Dark Mode Toggle */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            marginTop: 20,
            borderWidth: 3,
            borderRadius: 10,
            padding: 10,
            borderColor: currentColors.buttonBackground,
          }}
        >
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={Colors.trackColor}
            thumbColor={currentColors.thumbColor}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: currentColors.text, marginLeft: 10 }}>
            الوضع الليلي
          </Text>
        </View>

        <Image
          source={require("../../assets/images/login_background.png")}
          style={styles.backgroundImage}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  underline: {
    width: 60,
    height: 2,
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
  },
  separator: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
});

export default LoginScreen;
