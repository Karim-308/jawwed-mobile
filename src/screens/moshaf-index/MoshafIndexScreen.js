import React from 'react';
import { StyleSheet , SafeAreaView , TouchableWithoutFeedback , Keyboard } from 'react-native';
import IndexNavBar from './components/IndexNavBar';
import IndexTypeBar from './components/IndexTypeBar';
import IndexList from './components/IndexList';
import { Provider } from 'react-redux';
import store from '../../redux/store';

export default function MoshafIndexScreen() {

    return (
        <Provider store={store}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.indexScreen}>
                <IndexNavBar />
                <IndexTypeBar />
                <IndexList />
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </Provider>
    );
}

const styles = StyleSheet.create({
    indexScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000'
    }
});