import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const IntroScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();  
    }, 4000); // Display for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/splash_screen.png')} 
        style={styles.fullImage} 
        resizeMode="cover" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});

export default IntroScreen;
