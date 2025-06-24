import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { get, remove, save } from '../../utils/localStorage/secureStore';
import { CommonActions, useNavigation } from '@react-navigation/native';
import NotLoggedInMessage from './components/NotLoggedInMessage';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedOut } from '../../redux/actions/authActions';
import { setDarkMode } from '../../redux/actions/themeActions';
import Colors from '../../constants/newColors'; // Adjust path as needed
import requestUserPermission from '../../api/notifications/firebasetoken';
import { setNotificationsEnabled } from '../../redux/reducers/notificationReducer';

const TOKEN_KEY = 'userToken';
const EMAIL_KEY = 'userEmail';
const NAME_KEY = 'userName';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const notificationsEnabled = useSelector((state) => state.notification.notificationsEnabled);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
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

  const handleSignOut = async () => {
    try {
      await remove(TOKEN_KEY);
      await remove(EMAIL_KEY);
      await remove(NAME_KEY);

      dispatch(setLoggedOut());
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

  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !darkMode;
      await save('darkMode', newDarkMode.toString());
      dispatch(setDarkMode(newDarkMode));
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      await requestUserPermission();
    }
    dispatch(setNotificationsEnabled(!notificationsEnabled));
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
        <NotLoggedInMessage />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={Colors.highlight} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.label, { color: currentColors.text }]}>الاسم:</Text>
        <Text style={[styles.value, { color: currentColors.text }]}>{userInfo.name}</Text>

        <Text style={[styles.label, { color: currentColors.text }]}>البريد الإلكتروني:</Text>
        <Text style={[styles.value, { color: currentColors.text }]}>{userInfo.email}</Text>

        <View style={styles.toggleContainer}>
          <Text style={[styles.label, { color: currentColors.text }]}>الوضع الليلي:</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={Colors.trackColor}
            thumbColor={darkMode ? Colors.dark.thumbColor : Colors.light.thumbColor}
          />
        </View>
        <View style={styles.toggleContainer}>
          <Text style={[styles.label, { color: currentColors.text }]}>تفعيل الاشعارات</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={Colors.trackColor}
            thumbColor={notificationsEnabled ? Colors.dark.thumbColor : Colors.light.thumbColor}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.signOutButton, { backgroundColor: Colors.highlight }]} onPress={handleSignOut}>
        <Text style={styles.signOutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 20,
  },
  signOutButton: {
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ProfileScreen;
