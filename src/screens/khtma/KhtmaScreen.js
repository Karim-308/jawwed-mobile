import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import KhtmaList from './components/khtma-list/KhtmaList'
import KhtmaNewGoalMenu from './components/khtma-new-goal-menu/KhtmaNewGoalMenu';
import KhtmaGoalView from './components/khtma-goal-view/KhtmaGoalView';
import KhtmaErrorMessage from './components/khtma-error-message/KhtmaErrorMessage';
import NotLoggedInMessage from '../profile/components/NotLoggedInMessage';
import { get } from '../../utils/localStorage/secureStore';
import Colors from '../../constants/newColors';


export default function KhtmaScreen() {
    

    // check if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    useEffect(() => {
        const checkLogin = async () => {
            const token = await get('userToken');
            setIsLoggedIn(!!token);
        };

        checkLogin();
    }, []);


    // set the dark or light mode
    const [darkMode, setDarkMode] = useState(true);
    useEffect(() => {
        const loadDarkMode = async () => {
            const storedDarkMode = await get('darkMode');
            if (storedDarkMode !== null) {
                setDarkMode(storedDarkMode === 'true');
            } else {
                setDarkMode(true);
            }
        };

        loadDarkMode();
    }, []);
    const currentColors = darkMode ? Colors.dark : Colors.light;


    if (isLoggedIn === null) {
        return (
            <View style={[styles.container, { backgroundColor: currentColors.background }]}>
                <ActivityIndicator size="large" color={Colors.highlight} />
            </View>
        );
    }

    if (!isLoggedIn) {
        return (
            <View style={[styles.container, { backgroundColor: currentColors.background }]}>
                <NotLoggedInMessage />
            </View>
        );
    }

    return (
        <Provider store={store}>
            <SafeAreaView style={[styles.khtmaScreen, { backgroundColor: currentColors.background }]}>
                <KhtmaNewGoalMenu />
                <KhtmaGoalView />
                <KhtmaList />
                <KhtmaErrorMessage />
            </SafeAreaView>
        </Provider>
    );
}


const styles = StyleSheet.create({
    khtmaScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    container: {
        paddingTop: 70,
        flex: 1,
        padding: 16,
    },
});