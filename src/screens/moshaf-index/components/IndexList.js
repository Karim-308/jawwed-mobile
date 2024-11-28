import React from 'react';
import { StyleSheet , View , FlatList } from 'react-native';
import IndexListItem from './IndexListItem';
import { useSelector } from 'react-redux';

// Just a sample for preview
const indexTypesItems = {
  Chapter: [
    {number: '١', name: 'سُــــوْرَۃُ الفَاتِحَة'},
    {number: '٢', name: 'سُــــوْرَۃُ البـقرة'}
  ],
  Juz: [
    {number: '١', name: 'الجزء الأول'},
    {number: '٢', name: 'الجزء الثاني'}
  ]
};

export default function IndexList() {

    const indexType = useSelector((state) => state.mushafIndexType);
  
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