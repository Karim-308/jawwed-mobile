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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { loginWithGoogleToken } from "../../api/auth/login/loginApi";
import { get, save } from "../../utils/localStorage/secureStore";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../redux/actions/authActions";
import Colors from "../../constants/newColors";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(null);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "17494011183-ahptm29eh4vek9jdgdrsskk5mu4bbieo.apps.googleusercontent.com",
    webClientId:
      "17494011183-fmimqr7mgrrfubd6vsmdbd7vuejsae2l.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
  });

  // Load dark mode preference on mount
  useEffect(() => {
    const loadDarkMode = async () => {
      const storedDarkMode = await get("darkMode");
      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true");
      } else {
        setDarkMode(true); // default
      }
    };
    loadDarkMode();
  }, []);

  // Check login on mount
  useEffect(() => {
    const checkLogin = async () => {
      const token = await get("userToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  // Navigate if already logged in
  useEffect(() => {
    if (isLoggedIn === true) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [isLoggedIn]);

  // Handle Google login response
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
          navigation.navigate("Home");
        } catch (err) {
          console.error("❌ Login Error:", err);
          Alert.alert("Login Error", err.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      }
    };

    handleLogin();
  }, [response]);

  // Handle dark mode toggle
  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    await save("darkMode", value.toString());
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  // Loading screen
  if (isLoggedIn === null || loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentColors.loaderBackground }]}>
        <ActivityIndicator size="large" color={Colors.dark.underline} />
        <Text style={{ color: currentColors.loaderText, marginTop: 10 }}>
          {loading ? "Logging in..." : "Checking session..."}
        </Text>
      </View>
    );
  }

  // Login screen
  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.text }]}>Sign In</Text>
      <View style={[styles.underline, { backgroundColor: currentColors.underline }]} />

      {/* Dark Mode Toggle */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Text style={{ color: currentColors.text, marginRight: 10 }}>
          {darkMode ? "Dark Mode" : "Light Mode"}
        </Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={Colors.trackColor}
          thumbColor={currentColors.thumbColor}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}
        onPress={() => promptAsync()}
      >
        <Text style={[styles.buttonText, { color: currentColors.text }]}>Continue with Google</Text>
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.googleIcon}
        />
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.separator, { backgroundColor: currentColors.separator }]} />
        <Text style={[styles.orText, { color: currentColors.text }]}>OR</Text>
        <View style={[styles.separator, { backgroundColor: currentColors.separator }]} />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={[styles.buttonText, { color: currentColors.text }]}>Continue As Guest</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/login_background.png")}
        style={styles.backgroundImage}
      />
    </View>
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
