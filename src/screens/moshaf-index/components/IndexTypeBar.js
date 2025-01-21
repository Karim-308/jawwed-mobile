import React, { useState } from 'react';
import { StyleSheet , Text , View , TouchableOpacity , Animated } from 'react-native';
import { useSelector , useDispatch } from 'react-redux';
import { activateChapterIndexType , activateJuzIndexType } from '../../../redux/reducers/indexTypeReducer';
import { PRIMARY_GOLD , DARK_GREY} from '../../../constants/colors';

export default function IndexTypeBar() {

    const activeIndexType = useSelector((state) => state.indexType.mushafIndexType);
    const dispatch = useDispatch();

    const activateChapterIndex = () => {
      dispatch(activateChapterIndexType());
    }
    const activateJuzIndex = () => {
      dispatch(activateJuzIndexType());
    }

    /*
    TODO
    const activatePageIndex = () => {
      dispatch(activateJuzIndexType());
      setActiveIndexType('page');
    }
    */

    return (
        <View style={styles.indexTypeBar}>
            <TouchableOpacity 
              style={activeIndexType==='Juz'? styles.pressedIndexTypeButton : styles.unpressedIndexTypeButton} 
              onPress={() => activateJuzIndex()}>
              <Text>جُـــــزء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeIndexType==='Chapter'? styles.pressedIndexTypeButton : styles.unpressedIndexTypeButton} 
              onPress={() => activateChapterIndex()}>
              <Text style={styles.chapterIndexTypeText}>سُــــورة</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    indexTypeBar: {
      flex: 0.1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '95%',
      backgroundColor: `${DARK_GREY}`,
      borderRadius: 5,
      padding: 10,
      marginTop: -80
    },
    pressedIndexTypeButton: {
      fontSize: 15,
      color: '#fff',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: '#DE9953',
      paddingVertical: 10,
      paddingHorizontal: 45
    },
    unpressedIndexTypeButton: {
      fontSize: 15,
      color: '#fff',
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: '#3F3D1D',
      paddingVertical: 10,
      paddingHorizontal: 45
    }
});