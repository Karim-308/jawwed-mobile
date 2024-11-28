import React from 'react';
import { StyleSheet , View , TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SeacrhBar from './SearchBar';
import { PRIMARY_GOLD } from '../../../constants/colors';

export default function IndexNavBar() {
  
    // To Do later
    const goBack = () => {
    }
    const openSettings = () => {
    }

    return (
        <View style={styles.indexNavBar}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back-outline' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            <SeacrhBar />
            <TouchableOpacity onPress={openSettings}>
                <Ionicons name='settings-outline' size={24} color={PRIMARY_GOLD} />
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