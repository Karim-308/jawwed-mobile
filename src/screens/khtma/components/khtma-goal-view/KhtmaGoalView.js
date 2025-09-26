import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, TextInput} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { setIsGoalViewVisible, setSelectedGoal, setSelectedDay, setErrorStatus, setSelectedGoalData } from '../../../../redux/reducers/khtmaReducer';
import { PRIMARY_GOLD, DARK_GREY } from '../../../../constants/colors';
import { getGoal } from '../../../../api/khtma/getGoal';
import { toArabicNumerals } from '../../../../utils/helpers';
import { compareDateWithToday } from '../../../../utils/date-time-utils/DateTimeUtils';
import { setPageNumber } from '../../../../redux/actions/pageActions';
import { useNavigation } from '@react-navigation/native';
import { get } from '../../../../utils/localStorage/secureStore';
import Colors from '../../../../constants/newColors';


export default function KhtmaGoalView() {
    
    
    // Navigate to a specific mushaf page
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const goToMoshafPage = (pageNumber) => {
        dispatch(setPageNumber(pageNumber));
        navigation.navigate('MoshafPage');
    }

    // Selected Goal
    const selectedGoal = useSelector((state) => state.khtma.selectedGoal);
    const assignSelectedGoal = (chosenGoal) => {
        dispatch(setSelectedGoal(chosenGoal));
    }

    // Selected Goal
    const selectedGoalData = useSelector((state) => state.khtma.selectedGoalData);
    const assignSelectedGoalData = (chosenGoalData) => {
        dispatch(setSelectedGoalData(chosenGoalData));
    }

    // Selected Goal
    const assignSelectedDay = (selectedDay) => {
        dispatch(setSelectedDay(selectedDay));
    }

    // Selected Goal View
    const isGoalViewVisible = useSelector((state) => state.khtma.isGoalViewVisible);
    const assignIsGoalViewVisible = (goalViewVisible) => {
        dispatch(setIsGoalViewVisible(goalViewVisible));
    }

    const assignErrorStatus = (errorStatus) => {
        dispatch(setErrorStatus(errorStatus));
    }

    useEffect(() => {
        const fetchSelectedGoalData = async (goalId) => {
            const selectedGoalData = await getGoal(goalId);
            if (selectedGoalData !== 'error')
                assignSelectedGoalData(selectedGoalData);
            else
                assignErrorStatus('حدث خطأ ما أثناء عرض معلومات الختمة');
        };

        if(isGoalViewVisible)
            fetchSelectedGoalData(selectedGoal.goalId);
    }, [isGoalViewVisible])


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

    const getDayStatusColor = (date, status) => {

        if (compareDateWithToday(date) === 'equal') {
            if (status === 'InProgress')
                return PRIMARY_GOLD;
            else if (status === 'Completed')
                return '#0f0';
            else
                return (darkMode? '#fff' : '#000')
        }
        else if (compareDateWithToday(date) === 'past') {
            if (status === 'Completed')
                return '#0f0';
            else
                return '#ff0'
        }
        else {
            return (darkMode? '#fff' : '#000');
        }
    };

    return (
        <View>

            {/****************************** New Goal Menu Modal ******************************/}
            <Modal
                visible={isGoalViewVisible}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    assignIsGoalViewVisible(false);
                }}
            >
                <View style={[styles.modalOverlay, {backgroundColor: currentColors.background}]}>
                    <View style={[styles.modalContainer, {backgroundColor: currentColors.background}]}>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => {
                                assignIsGoalViewVisible(false);
                            }}
                        >
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* View Title */}
                        <Text style={[styles.modalTitle, {color: currentColors.text}]}>{selectedGoal.title}</Text>
                        
                        {/* Goal Days */}
                        <FlatList
                            data={selectedGoalData.readingSchedule}
                            keyExtractor={(item) => item.id}
                            numColumns={4}
                            columnWrapperStyle={styles.goalDays}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        if (item.status === 'Completed') {
                                            assignErrorStatus('لقد أنهيت ذلك اليوم بالفعل، ولكن يمكنك دائما القراءة في المصحف');
                                        }
                                        else if (compareDateWithToday(item.scheduledDate) === 'future') {
                                            assignErrorStatus('لم يحن موعد ذلك اليوم بعد، ولكن يمكنك دائما القراءة في المصحف');
                                        }
                                        else {
                                            assignSelectedDay(item);
                                            goToMoshafPage(item.startPage + item.actualPagesRead);
                                            assignIsGoalViewVisible(false);
                                        }
                                    }}>
                                        <View style={[styles.goalDay, {borderColor: getDayStatusColor(item.scheduledDate, item.status), backgroundColor: currentColors.cardBackground}]}>
                                            {
                                            compareDateWithToday(item.scheduledDate) === 'future'?
                                                <MaterialIcons name="lock-outline" size={10} color="black" />
                                                :
                                                <Text style={styles.dayNumber}>
                                                    {toArabicNumerals(item.dayNumber)}
                                                </Text>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />

                    </View>
                </View>
            </Modal>
            {/*********************************************************************************/}

        </View>
    );
}


const styles = StyleSheet.create({

    // All Modals
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9
    },
    modalContainer: {
        height: '60%',
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PRIMARY_GOLD,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    goalDays: {
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%'
    },
    goalDay: {
        width: 50,
        height: 50,
        padding: 10,
        borderBottomWidth: 5,
        borderRadius: 10,
        margin: 5
    },
    dayNumber: {
        textAlign: 'center',
        fontSize: 20,
    }
});