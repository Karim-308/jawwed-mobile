import { SafeAreaView,StyleSheet } from 'react-native';
import MoshafPage2 from './components/MoshafPage2';
import MoshafPage from './components/MoshafPage';
import Header from './components/MoshafHeader';
import QuranText from './components/QuranText';
import BottomNavigationBar from './components/BottomNav';
import BlankNavBar from './components/BlankNavBar';
import { Provider } from 'react-redux';
import store from '../../redux/store';

const MoshafScreen = () => {
    return (
        <SafeAreaView style={styles.PageContainer}>
        <Provider store={store}>
            <Header />
            <MoshafPage />
            {/*<BlankNavBar />*/}
            <BottomNavigationBar />
        </Provider>
        </SafeAreaView>
    );
}

export default MoshafScreen;


const styles = StyleSheet.create({
    PageContainer: {
        justifyContent: 'space-between',
        allignItems: 'center',
        flex: 1,
        backgroundColor: 'black',
    },

});