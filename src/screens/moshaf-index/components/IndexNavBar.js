import React from 'react';
import { StyleSheet , View , TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SeacrhBar from './SearchBar';
import { PRIMARY_GOLD } from '../../../constants/colors';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function IndexNavBar() {
  
    // go to bookmark page
    const navigation = useNavigation();
    const goToBookmarksScreen = () => {
        const currentState = navigation.getState();
        const screenIndex = currentState.routes.findIndex(route => route.name ==='BookmarkPage');
        if(screenIndex !== -1) {
            const {routes} = navigation.getState();
            for (let i=0; i<routes.length-screenIndex; i++) {
              navigation.pop();
            }
            for (let i=0; i<routes.length-screenIndex-1; i++) {
              navigation.push(routes[screenIndex+i].name);
            }
        }
        navigation.navigate('BookmarkPage');
    }

    return (
        <View style={styles.indexNavBar}>
            <SeacrhBar />
            <TouchableOpacity style={styles.bookmarksButton} onPress={() => goToBookmarksScreen()}>
                <Ionicons name='bookmark' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    indexNavBar: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -75
    },
    bookmarksButton: {
        marginRight: 10
    }
});