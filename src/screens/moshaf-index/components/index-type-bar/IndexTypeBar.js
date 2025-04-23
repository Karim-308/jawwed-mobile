import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setIndexType } from '../../../../redux/reducers/indexReducer';


export default function IndexTypeBar() {

    const indexType = useSelector((state) => state.index.indexType);
    const dispatch = useDispatch();
    const assignIndexType = (indexType) => {
      dispatch(setIndexType(indexType));
    }

    return (
        <View style={styles.indexTypeBar}>
            <TouchableOpacity
              style={[styles.indexTypeButton, {backgroundColor: indexType==='Juz'? '#DE9953' : '#3F3D1D'} ]}
              onPress={() => {if(indexType !== 'Juz') assignIndexType('Juz')}}>
              <Text style={styles.IndexTypeText}>جُـــــزء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.indexTypeButton, {backgroundColor: indexType==='Chapter'? '#DE9953' : '#3F3D1D'} ]} 
              onPress={() => {if(indexType !== 'Chapter') assignIndexType('Chapter')}}>
              <Text style={styles.IndexTypeText}>سُــــورة</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    indexTypeBar: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    indexTypeButton: {
      borderStyle: 'solid',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 50
    },
    IndexTypeText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#fff'
    }
});