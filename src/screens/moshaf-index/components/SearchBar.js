import React, { useState } from 'react';
import { StyleSheet , View , TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../constants/colors';

export default function SeacrhBar() {

    const [searchInput, setSearchInput] = useState('');
    const clearSearchInput = () => {
        setSearchInput('');
    }

    // to do later
    const searchHandler = (newSearchInput) => {
    }

    return (
        <View style={styles.searchBar}>
            {(searchInput)? (
                <TouchableOpacity onPress={() => clearSearchInput()}>
                    <Ionicons name='close-outline' size={18} color={PRIMARY_GOLD} />
                </TouchableOpacity>
            ): <View></View>
            }
            <TextInput
                color='#fff'
                placeholder='انقر هنـــا للبحث'
                placeholderTextColor='#888'
                width='80%'
                writingDirection='rtl'
                textAlign='right'
                value={searchInput}
                onChangeText={(newSearchInput) => setSearchInput(newSearchInput)}
            />
            <TouchableOpacity onPress={() => searchHandler(searchInput)}>
                <Ionicons name='search-outline' size={18} color={PRIMARY_GOLD} />
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
        height: '18%',
        marginHorizontal: 10,
        paddingHorizontal: 10,
        backgroundColor: '#222',
        borderStyle: 'solid',
        borderWidth: 1.5,
        borderColor: `${PRIMARY_GOLD}`,
        borderRadius: 10,
    }
});