import React from 'react';
import { StyleSheet , View , TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SeacrhBar from './SearchBar';
import { PRIMARY_GOLD } from '../../../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function IndexNavBar() {
  
    // go to bookmark page
    const navigation = useNavigation();
    const goToBookmarkPage = () => {
      navigation.navigate('BookmarkPage')
    }

    return (
        <View style={styles.indexNavBar}>
            <SeacrhBar />
            <TouchableOpacity onPress={() => goToBookmarkPage()}>
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
    }
});