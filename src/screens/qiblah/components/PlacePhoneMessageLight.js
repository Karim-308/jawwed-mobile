import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../../../constants/newColors'; // adjust path if needed

const PlacePhoneMessageLight = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/flat-surface-light.png')}
        style={styles.image}
      />
      <Text style={styles.text}>يرجى وضع الهاتف على سطح مستوٍ</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    flex: 1,
    paddingTop: 100,
    backgroundColor: "White"
,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 22,
    color: Colors.light.text,
    textAlign: 'center',
    fontFamily: 'UthmanicHafs',
  },
});

export default PlacePhoneMessageLight;
