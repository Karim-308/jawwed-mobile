import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';

const NotLoggedInMessage = () => {
  const navigation = useNavigation();

  const goToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        لا يمكنك عرض معلوماتك حاليًا، يجب عليك تسجيل الدخول أولًا
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
        <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#EFB975',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotLoggedInMessage;
