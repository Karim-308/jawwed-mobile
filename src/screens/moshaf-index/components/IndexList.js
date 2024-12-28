import React from 'react';
import { StyleSheet , View , FlatList } from 'react-native';
import IndexListItem from './IndexListItem';
import { useSelector } from 'react-redux';
import { indexTypesItems } from './IndexData'

export default function IndexList() {

    const indexType = useSelector((state) => state.indexType.mushafIndexType);
  
    return (
        <View style={styles.indexList}>
            <FlatList 
                data={indexTypesItems[indexType]}
                renderItem={({item}) => <IndexListItem item={item} />}
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
        marginTop: 50
    }
});