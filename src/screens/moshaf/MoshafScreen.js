import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Header from './components/MoshafHeader';
import MoshafPage from './components/MoshafPage';
import BottomNavigationBar from './components/BottomNav';
import { Provider } from 'react-redux';
import store from '../../redux/store';

const MoshafScreen = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header />

        {/* Quran Text */}
        <View style={styles.content}>
          <MoshafPage />
        </View>

        {/* Bottom Navigation */}
        <BottomNavigationBar />
      </SafeAreaView>
    </Provider>
  );
};

export default MoshafScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Match the background color with the app
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 0, // Remove unnecessary gaps
  },
});
