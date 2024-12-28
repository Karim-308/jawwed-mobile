import React, { useState } from 'react';
import { StyleSheet , Text , View , TouchableOpacity , Animated } from 'react-native';
import { useSelector , useDispatch } from 'react-redux';
import { activateChapterIndexType , activateJuzIndexType } from '../../../redux/reducers/indexTypeReducer';
import { PRIMARY_GOLD , DARK_GREY} from '../../../constants/colors';

export default function IndexTypeBar() {

    const indexType = useSelector((state) => state.indexType.mushafIndexType);
    const dispatch = useDispatch();
    const activateChapterIndex = () => {
      dispatch(activateChapterIndexType());
      activateChapterType(1.5);
      activateJuzType(0);
    }
    const activateJuzIndex = () => {
      dispatch(activateJuzIndexType());
      activateChapterType(0);
      activateJuzType(1.5);
    }

    // The animation of switching between different index types
    const [chapterIndexBorderWidth] = useState(new Animated.Value(1.5));
    const [juzIndexBorderWidth] = useState(new Animated.Value(0));
    const activateChapterType = (newValue) => {
      Animated.timing(chapterIndexBorderWidth,
      {
        toValue: newValue,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
    const activateJuzType = (newValue) => {
      Animated.timing(juzIndexBorderWidth,
      {
        toValue: newValue,
        duration: 300,
        useNativeDriver: false
      }).start();
    }

    return (
        <View style={styles.indexTypeBar}>
            <TouchableOpacity onPress={() => activateJuzIndex()}>
              <Text style={styles.juzIndexTypeText}>جُـــــزء</Text>
              <Animated.View style={[styles.juzIndexTypeText, {
                  borderBottomWidth: juzIndexBorderWidth}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => activateChapterIndex()}>
              <Text style={styles.chapterIndexTypeText}>سُــــورة</Text>
              <Animated.View style={[styles.chapterIndexTypeText, {
                  borderBottomWidth: chapterIndexBorderWidth}]}
              />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    indexTypeBar: {
        flex: 0.05,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '70%',
        backgroundColor: `${DARK_GREY}`,
        borderRadius: 5,
        padding: 10,
        marginTop: -75
    },
    chapterIndexTypeText: {
        fontSize: 15,
        color: '#fff',
        borderBottomStyle: 'solid',
        borderBottomColor: `${PRIMARY_GOLD}`,
        paddingTop: 5
    },
    juzIndexTypeText: {
      fontSize: 15,
      color: '#fff',
      borderBottomStyle: 'solid',
      borderBottomColor: `${PRIMARY_GOLD}`,
      paddingTop: 5
    }
});