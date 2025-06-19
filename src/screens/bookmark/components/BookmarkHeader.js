import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../../constants/newColors"; // adjust path if needed

const BookmarkListHeader = ({ title, darkMode }) => {
  const currentColors = darkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.headerContainer, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.headerText, { color: currentColors.text }]}>
        {title}
      </Text>
      <View style={[styles.headerDivider, { backgroundColor: currentColors.text, opacity: 0.1 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 10,
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 22,
    fontFamily: "UthmanicHafs",
  },
  headerDivider: {
    height: 1,
    marginTop: 6,
    marginHorizontal: 2,
  },
});

export default BookmarkListHeader;
