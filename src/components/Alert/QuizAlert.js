import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const QuizAlert = ({ visible, onClose, message }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Ionicons name="checkmark-circle" size={48} color="#F4A950" />
          <Text style={styles.title}> تم الاختبار</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okText}>الصفحة الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "80%",
    borderColor: "#F4A950",
    borderWidth: 1.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F4A950",
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
  },
  okButton: {
    backgroundColor: "#F4A950",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  okText: {
    fontSize: 16,
    color: "#000",
  },
});
