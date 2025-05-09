import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { loginWithGoogleToken } from "../../api/auth/login/loginApi";
import { get } from "../../utils/localStorage/secureStore";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../redux/actions/authActions";
import { set } from "lodash";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(null);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);


  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "17494011183-ahptm29eh4vek9jdgdrsskk5mu4bbieo.apps.googleusercontent.com",
    webClientId:
      "17494011183-fmimqr7mgrrfubd6vsmdbd7vuejsae2l.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
  });

  // Step 1: Check if already logged in (on mount)
  useEffect(() => {
    const checkLogin = async () => {
      const token = await get("userToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  // Step 2: If logged in, navigate to Home
  useEffect(() => {
    if (isLoggedIn === true) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [isLoggedIn]);
  

  // Step 3: Handle Google login response
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

  // Step 4: Handle loading state
  if (isLoggedIn === null || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EFB975" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          {loading ? "Logging in..." : "Checking session..."}
        </Text>
      </View>
    );
  }
  

  // Step 5: Show login screen if not logged in
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.underline} />

      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Continue with Google</Text>
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.googleIcon}
        />
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Continue As Guest</Text>
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
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#ddd",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  underline: {
    width: 60,
    height: 2,
    backgroundColor: "#E0A500",
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#ddd",
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
    backgroundColor: "#555",
  },
  orText: {
    color: "#ddd",
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
