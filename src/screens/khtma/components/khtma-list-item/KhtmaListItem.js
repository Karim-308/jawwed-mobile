import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ToastAndroid, Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Progress from 'react-native-progress';
import { setSelectedGoal, setIsGoalViewVisible, setDidGoalsChange, setErrorStatus } from '../../../../redux/reducers/khtmaReducer';
import { deleteGoal } from '../../../../api/khtma/deleteGoal';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_GOLD, DARK_GREY } from '../../../../constants/colors';
import { formatDate } from '../../../../utils/date-time-utils/DateTimeUtils';
import { toArabicNumerals } from '../../../../utils/helpers';
import { get } from '../../../../utils/localStorage/secureStore';
import Colors from '../../../../constants/newColors';


export default function KhtmaListItem({goal}) {

    const dispatch = useDispatch();
    
    const assignSelectedGoal = (chosenGoal) => {
      dispatch(setSelectedGoal(chosenGoal));
    }

    const assignIsGoalViewVisible = (goalViewVisible) => {
      dispatch(setIsGoalViewVisible(goalViewVisible));
    }

    const assignDidGoalsChange = (didGoalsChange) => {
      dispatch(setDidGoalsChange(didGoalsChange));
    }

    // set the dark or light mode
    const [darkMode, setDarkMode] = useState(true);
    useEffect(() => {
        const loadDarkMode = async () => {
            const storedDarkMode = await get('darkMode');
            if (storedDarkMode !== null) {
                setDarkMode(storedDarkMode === 'true');
            } else {
                setDarkMode(true);
            }
        };

        loadDarkMode();
    }, []);
    const currentColors = darkMode ? Colors.dark : Colors.light;

    return (
      <TouchableOpacity onPress={() => {
        assignSelectedGoal(goal);
        assignIsGoalViewVisible(true);
      }}>
        <View style={[styles.goal, {backgroundColor: currentColors.cardBackground}]}>
          <View style={styles.goalInfo}>
            <TouchableOpacity onPress={async () => {
              const response = await deleteGoal(goal.goalId);
              if (response !== 'error') {
                if (Platform.OS === 'android')
                    ToastAndroid.show('تم حذف الختمة بنجاح', ToastAndroid.SHORT);
                else
                    Alert.alert('Success', 'تم حذف الختمة بنجاح');
                  
                assignDidGoalsChange(true);
              }
              else
                setErrorStatus('حدث خطأ ما أثناء حذف الختمة');
            }}>
                <MaterialIcons name='delete-outline' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            
            <Text style={[styles.goalTitle, {color: currentColors.text}]}>{goal.title}</Text>
          </View>
          <Text style={[styles.goalDate, {color: currentColors.text}]}>
            من {toArabicNumerals(formatDate(goal.startDate))} إلى {toArabicNumerals(formatDate(goal.endDate))}
          </Text>
          <View style={styles.goalStatus}>
            <Text style={[styles.goalProgressPercentage, {color: currentColors.text}]}>{toArabicNumerals(goal.progressPercent)}%</Text>
            <Progress.Bar
              progress={1-goal.progressPercent/100}
              width={250}
              height={15}
              color={'#e6e6e6'}
              unfilledColor={PRIMARY_GOLD}
              borderRadius={10}
              borderColor={PRIMARY_GOLD}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    goal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PRIMARY_GOLD,
        borderRadius: 15,
        padding: 15,
        margin: 10,
    },
    goalInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        marginVertical: 10
    },
    goalStatus: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    goalTitle: {
      fontSize: 22,
      color: '#fff',
      marginHorizontal: 10
    },
    goalProgressPercentage: {
      textAlign: 'center',
      fontSize: 20,
      color: '#fff',
      marginRight: 15
    },
    goalDate: {
      fontSize: 10,
      color: '#fff',
      margin: 10
    }
});