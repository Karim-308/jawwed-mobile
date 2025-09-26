import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/newColors";
import { get } from "../../utils/localStorage/secureStore";
import { useSelector } from "react-redux"; // Redux for dark mode

const QuizAlert = ({ visible, onClose, message }) => {
  const darkMode = useSelector((state) => state.darkMode.darkMode); // Redux for dark mode

  const currentColors = darkMode ? Colors.dark : Colors.light;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalBox,
            {
              backgroundColor: currentColors.optionBackground,
              borderColor: Colors.highlight,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={48} color={Colors.highlight} />
          <Text style={[styles.title, { color: Colors.highlight }]}>تم الاختبار</Text>
          <Text style={[styles.message, { color: currentColors.text }]}>{message}</Text>
          <TouchableOpacity
            style={[styles.okButton, { backgroundColor: Colors.highlight }]}
            onPress={onClose}
          >
            <Text style={[styles.okText, { color: currentColors.navButtonText }]}>الصفحة الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default QuizAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "80%",
    borderWidth: 1.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
  },
  okButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  okText: {
    fontSize: 16,
  },
});
