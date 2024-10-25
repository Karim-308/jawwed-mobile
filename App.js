import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MoshafScreen from './src/screens/moshaf/MoshafScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MoshafScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
