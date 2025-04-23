import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setSearchInput } from '../../../../redux/reducers/indexReducer';
import { PRIMARY_GOLD } from '../../../../constants/colors';


export default function SeacrhBar() {

    const searchInput = useSelector((state) => state.index.searchInput);
    const dispatch = useDispatch();
    const assignSearchInput = (searchInput) => {
      dispatch(setSearchInput(searchInput));
    }

    return (
        <View style={styles.searchBar}>
            <TextInput
                color='#fff'
                placeholder='اضغط هنـــا للبحث'
                placeholderTextColor='#888'
                width='85%'
                writingDirection='rtl'
                textAlign='right'
                value={searchInput}
                onChangeText={(newSearchInput) => assignSearchInput(newSearchInput)}
            />
            <Ionicons name='search-outline' size={18} color={PRIMARY_GOLD} />
        </View>
    );
}


const styles = StyleSheet.create({
    searchBar: {
        flex: 0.65,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#222',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: `${PRIMARY_GOLD}`,
        borderRadius: 10,
    }
});