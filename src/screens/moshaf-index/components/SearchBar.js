import React, { useState } from 'react';
import { StyleSheet , View , TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../constants/colors';

export default function SeacrhBar() {

    // To Do later
    const [searchInput, setSearchInput] = useState('');
    const searchHandler = () => {
    }
    const clearSearchInput = () => {
    }

    return (
        <View style={styles.searchBar}>
            <TouchableOpacity onPress={clearSearchInput}>
              <Ionicons name='close-outline' size={18} color='#fff' />
            </TouchableOpacity>
            <TextInput
                color='#fff'
                placeholder='ابحث هنـــا'
                placeholderTextColor='#fff'
                width='80%'
                writingDirection='rtl'
                textAlign='center'
                onChangeText={(newSearchInput) => setSearchInput(newSearchInput)}
            />
            <TouchableOpacity onPress={searchHandler}>
                <Ionicons name='search-outline' size={18} color='#fff' />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '15%',
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderStyle: 'solid',
        borderWidth: 1.5,
        borderColor: `${PRIMARY_GOLD}`,
        borderRadius: '5px',
    }
});