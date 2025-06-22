import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { getAzkarCategories } from "../../api/azkar/getAzkarCategories";
import { useNavigation } from "@react-navigation/native";
import { get } from "../../utils/localStorage/secureStore";
import Colors from "../../constants/newColors";
import { useSelector } from "react-redux";

// Memoized card component
const AzkarCard = React.memo(({ item, onPress, darkMode, currentColors }) => (
  <TouchableOpacity
    style={[styles.cardWrapper, { backgroundColor: currentColors.cardBackground }]}
    onPress={() => onPress(item)}
  >
    <View style={styles.imageContainer}>
      <Image
        source={require("../../assets/images/azkar-background.png")}
        style={[styles.decorImage, { opacity: darkMode ? 0.3 : 0.7 }]}
        resizeMode="contain"
      />
    </View>

    <Text style={[styles.cardTitle, { color: currentColors.text }]}>
      {item.category}
    </Text>

    <View style={styles.imageContainer2}>
      <Image
        source={require("../../assets/images/azkar-background.png")}
        style={[styles.decorImage, { opacity: darkMode ? 0.3 : 0.7 }]}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
));

const AzkarCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.darkMode.darkMode);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAzkarCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);



  const currentColors = darkMode ? Colors.dark : Colors.light;

  const handleCardPress = (item) => {
    navigation.navigate("AzkarDetailsPage", {
      categoryId: item.categoryId,
      title: item.category,
    });
  };

  const renderCard = useCallback(
    ({ item }) => (
      <AzkarCard
        item={item}
        onPress={handleCardPress}
        darkMode={darkMode}
        currentColors={currentColors}
      />
    ),
    [darkMode, currentColors]
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <ActivityIndicator color={Colors.highlight} size="large" />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <FlatList
        data={categories}
        renderItem={renderCard}
        keyExtractor={(item) => item.categoryId.toString()}
        contentContainerStyle={styles.cardContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default AzkarCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    paddingBottom: 30,
  },
  cardWrapper: {
    height: 70,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    top: "50%",
    left: "10%",
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    zIndex: 0,
  },
  imageContainer2: {
    position: "absolute",
    top: "50%",
    right: "10%",
    width: 60,
    height: 60,
    marginRight: -30,
    marginTop: -30,
    zIndex: 0,
  },
  decorImage: {
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "UthmanicHafs",
    fontWeight: "600",
    textAlign: "center",
    zIndex: 1,
  },
});
