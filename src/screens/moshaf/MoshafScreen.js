import { SafeAreaView,StyleSheet } from 'react-native';
import MoshafPage from './components/MoshafPage';
import Header from './components/MoshafHeader';
import QuranText from './components/QuranText';
import BottomNavigationBar from './components/BottomNav';
import BlankNavBar from './components/BlankNavBar';
import { Provider } from 'react-redux';
import store from '../../redux/store';

const MoshafScreen = () => {
    return (
        <Provider store={store}>
        <SafeAreaView style={styles.PageContainer}>
            <Header />
            <MoshafPage />
            <BlankNavBar />
            <BottomNavigationBar />
        </SafeAreaView>
        </Provider>
    );
}

export default MoshafScreen;


const styles = StyleSheet.create({
    PageContainer: {
        justifyContent: 'center',
        allignItems: 'center',
        flex: 1,
        backgroundColor: '#499170',
    },

});