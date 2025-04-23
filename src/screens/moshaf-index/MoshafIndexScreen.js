import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import IndexNavBar from './components/index-nav-bar/IndexNavBar';
import IndexSearchBar from './components/index-search-bar/IndexSearchBar';
import IndexList from './components/index-list/IndexList';


export default function MoshafIndexScreen() {

    return (
        <Provider store={store}>
            <SafeAreaView style={styles.indexScreen}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAwareScrollView>
                        <View style={styles.indexNavBar}>
                            <IndexNavBar />
                        </View>
                        <View style={styles.indexSearchBar}>
                            <IndexSearchBar />
                        </View>
                        <View style={styles.indexList}>
                            <IndexList />
                        </View>
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </Provider>
    );
}


const styles = StyleSheet.create({
    indexScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    indexNavBar: {
        flex: 0.1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    indexSearchBar: {
        flex: 0.1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000',
        marginVertical: 10
    },
    indexList: {
        flex: 0.8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000'
    }
});