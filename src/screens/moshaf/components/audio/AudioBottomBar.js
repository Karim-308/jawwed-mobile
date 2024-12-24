import React from 'react';
import { StyleSheet , SafeAreaView, View , TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { toggleAudioRepeat , toggleAudioPanel } from '../../../../redux/reducers/audioReducer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_GOLD , DARK_GREY } from '../../../../constants/colors';
import ReciterName from './ReciterName';

export default function AudioBottomBar() {

  const dispatch = useDispatch();
  const toggleAudioRepetition = () => {
    dispatch(toggleAudioRepeat());
  }
  const toggleAudioPanalVisibility = () => {
    dispatch(toggleAudioPanel());
  }

  return (
    <SafeAreaView style={styles.container}>

      <ReciterName />

      <TouchableOpacity onPress={()=> toggleAudioRepetition}>
        <Ionicons name='repeat-outline' size={30} color={PRIMARY_GOLD} />
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name='close' size={30} color={PRIMARY_GOLD} />
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={styles.pauseIcon}>
          <Ionicons name='pause' size={24} color={PRIMARY_GOLD} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> toggleAudioPanalVisibility}>
        <MaterialIcons name='keyboard-double-arrow-up' size={30} color={PRIMARY_GOLD} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: DARK_GREY,
    padding: 8,
  },
  pauseIcon: {
    borderStyle: 'solid',
    borderColor: PRIMARY_GOLD,
    borderWidth: 2,
    borderRadius: 18,
    padding: 10,
    marginTop: -50
  }
});
