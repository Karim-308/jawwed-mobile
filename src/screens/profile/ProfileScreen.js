import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { get, remove } from '../../utils/localStorage/secureStore'; 
import { CommonActions, useNavigation } from '@react-navigation/native';
import NotLoggedInMessage from './components/NotLoggedInMessage';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedOut } from '../../redux/actions/authActions';

const TOKEN_KEY = 'userToken';
const EMAIL_KEY = 'userEmail';
const NAME_KEY = 'userName';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn,setIsLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await get(TOKEN_KEY);
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const name = await get(NAME_KEY);
        const email = await get(EMAIL_KEY);
        setUserInfo({ name, email });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await remove(TOKEN_KEY);
      await remove(EMAIL_KEY);
      await remove(NAME_KEY);

      dispatch(setLoggedOut()); // Update Redux state
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      Alert.alert('حدث خطأ أثناء تسجيل الخروج');
      console.error('Sign-out error:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <NotLoggedInMessage />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#EFB975" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>الاسم:</Text>
        <Text style={styles.value}>{userInfo.name}</Text>

        <Text style={styles.label}>البريد الإلكتروني:</Text>
        <Text style={styles.value}>{userInfo.email}</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
  },
  label: {
    color: '#EFB975',
    fontSize: 18,
    marginBottom: 5,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#EFB975',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  notLoggedInText: {
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

export default ProfileScreen;
