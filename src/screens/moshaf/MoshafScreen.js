import { SafeAreaView,StyleSheet } from 'react-native';
import MoshafPage from './components/MoshafPage';


const MoshafScreen = () => {
    return (
        <SafeAreaView style={styles.PageContainer}>
            <MoshafPage />
        </SafeAreaView>
    );
}

export default MoshafScreen;


const styles = StyleSheet.create({
    PageContainer: {
        paddingTop:40,
        paddingBottom:10,
        justifyContent: 'center',
        allignItems: 'center',
        flex: 1,
        backgroundColor: '#499170',
    },

});