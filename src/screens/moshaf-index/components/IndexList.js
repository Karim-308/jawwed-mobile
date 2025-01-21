import React from 'react';
import { StyleSheet , View , FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import IndexListItem from './IndexListItem';
import { useSelector } from 'react-redux';
import { indexTypesItems } from './IndexData'

export default function IndexList() {

    const indexType = useSelector((state) => state.indexType.mushafIndexType);
  
    return (
        <View style={styles.indexList}>
            <FlatList 
                data={indexTypesItems[indexType]}
                keyExtractor={(item) => item.number}
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
        alignItems: 'center',
        marginTop: 20
    }
});