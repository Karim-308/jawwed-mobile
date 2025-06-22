import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { get } from "../../../utils/localStorage/secureStore"; // Adjust path as necessary
import Colors from "../../../constants/newColors"; // Adjust path as necessary
import { useSelector } from "react-redux"; // Redux for dark mode

const NotLoggedInMessage = () => {
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.darkMode.darkMode);

  const currentColors = darkMode ? Colors.dark : Colors.light;

  const goToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <Text style={[styles.message, { color: currentColors.text }]}>
        لا يمكنك عرض معلوماتك حاليًا، يجب عليك تسجيل الدخول أولًا
      </Text>
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: Colors.highlight }]}
        onPress={goToLogin}
      >
        <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  loginButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotLoggedInMessage;
