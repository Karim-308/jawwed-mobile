import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the arrow icon

const Header = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.backButton}
        activeOpacity={0.6}
      >
        <Ionicons name="arrow-back" size={40} color="#FFD700" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Bookmark</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Header;
