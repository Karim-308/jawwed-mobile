// components/PlacePhoneMessage.js

import { View, Text, StyleSheet, Image } from 'react-native';

const PlacePhoneMessage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/flat-surface-dark.png')}
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
    backgroundColor: 'black',
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'UthmanicHafs',
  },
});

export default PlacePhoneMessage;
