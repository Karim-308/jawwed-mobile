import React from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import { useSelector } from 'react-redux';
import IndexListItem from '../index-list-item/IndexListItem';
import { indexTypesItems } from '../IndexData'
import { reformatWord } from './IndexListFunctions';


export default function IndexList() {

    const indexType = useSelector((state) => state.index.indexType);
    const searchInput = useSelector((state) => state.index.searchInput);
  
    return (
        <View style={styles.indexList}>
            <VirtualizedList
                style={{flex: 1, margin: 5}}
                data={indexTypesItems[indexType]}
                initialNumToRender={30}
                renderItem={({item}) => {
                    if (item.name.includes(searchInput) || reformatWord(item.name).includes(searchInput))
                        return <IndexListItem item={item} />;
                }}
                keyExtractor={(item) => item.number}
                getItemCount={(data) => data.length}
                getItem={(data, index) => data[index]}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    indexList: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 10
    }
});