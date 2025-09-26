import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, TextInput, ToastAndroid, Alert, Platform} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setIsNewGoalMenuVisible, setErrorStatus, setDidGoalsChange } from '../../../../redux/reducers/khtmaReducer';
import { khtmaTypeOptionData, khtmaDurationOptionData } from '../../khtmaData';
import { createNewKhtma } from '../../../../api/khtma/postGoal';
import { getOptionBorderColor } from './KhtmaNewGoalMenuFunctions';
import { PRIMARY_GOLD, DARK_GREY, DARK_GOLD } from '../../../../constants/colors';
import { get } from '../../../../utils/localStorage/secureStore';
import Colors from '../../../../constants/newColors';


export default function KhtmaNewGoalMenu() {


    const dispatch = useDispatch();
    
    // New Goal Menu
    const isNewGoalMenuVisible = useSelector((state) => state.khtma.isNewGoalMenuVisible);
    const assignIsNewGoalMenuVisible = (newGoalMenuVisible) => {
        dispatch(setIsNewGoalMenuVisible(newGoalMenuVisible));
    }

    const assignDidGoalsChange = (didGoalsChange) => {
        dispatch(setDidGoalsChange(didGoalsChange));
    }

    const assignErrorStatus = (errorStatus) => {
        dispatch(setErrorStatus(errorStatus));
    }

    // Subsettings Menu (option menu)
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [subMenuTitle, setSubMenuTitle] = useState(null);
    const [subMenuData, setSubMenuData] = useState(null);

    const [khtmaTitle, setKhtmaTitle] = useState(null);
    const [khtmaType, setKhtmaType] = useState(null);
    const [khtmaDuration, setKhtmaDuration] = useState(null);
    const [khtmaReminderTime, setKhtmaReminderTime] = useState(null);


    // Show options sub-menus when selected
    const showSubMenu = (optionSelected) => {

        if(optionSelected === 'khtmaType')
            setkhtmaTypeSubMenuData();
        else if(optionSelected === 'khtmaDuration')
            setKhtmaDurationSubMenuData();

        if (isSubMenuVisible === false) {
            setSelectedOption(optionSelected);
            setIsSubMenuVisible(true);
        }
    }

    // Close options sub-menus
    const closeSubMenu = () => {
        setIsSubMenuVisible(false);
        setSelectedOption(null);
    }

    // Prepare the sub-menu data that will be displayed
    const setkhtmaTypeSubMenuData = () => {
        setSubMenuTitle('اختر نـوع الختمــة');
        setSubMenuData(khtmaTypeOptionData);
    }
    const setKhtmaDurationSubMenuData = () => {
        setSubMenuTitle('اختر مـدة الختمــة');
        setSubMenuData(khtmaDurationOptionData);
    }

    // Set option to the selected value
    const setOptionValue = (item) => {
        if(selectedOption === 'khtmaType') {
            setKhtmaType(item);
            closeSubMenu();
        }
        else if(selectedOption === 'khtmaDuration') {
            setKhtmaDuration(item);
            closeSubMenu();
        }
    }

    const clearOptionsValues = () => {
        setKhtmaTitle(null);
        setKhtmaType(null);
        setKhtmaDuration(null);
        setKhtmaReminderTime(null);
    }

    // submit values and create khtma
    const createKhtma = async () => {
        if (khtmaTitle && khtmaType && khtmaDuration && khtmaReminderTime) {
            const data = await createNewKhtma(
                khtmaTitle,
                khtmaType.totalPages,
                khtmaType.startPage,
                khtmaDuration.totalDays,
                khtmaReminderTime
            );
            if (data !== 'error') {
                if (Platform.OS === 'android')
                    ToastAndroid.show('تم إنشاء الختمة بنجاح', ToastAndroid.SHORT);
                else
                    Alert.alert('Success', 'تم إنشاء الختمة بنجاح');
                assignDidGoalsChange(true);
                assignIsNewGoalMenuVisible(false);
                clearOptionsValues();
            }
            else {
                assignErrorStatus('حدث خطأ أثناء إنشاء الختمة، حاول مجدداً');
            }
        }
        else {
            assignErrorStatus('من فضلك أكمل البيانات بشكل صحيح أولاً');
        }
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
        <View>
        
            {/****************************** New Goal Menu Modal ******************************/}
            <Modal
                visible={isNewGoalMenuVisible}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    assignIsNewGoalMenuVisible(false);
                    clearOptionsValues();
                }}
            >
                <View style={[styles.modalOverlay, {backgroundColor: currentColors.background}]}>
                    <View style={[styles.modalContainer, {backgroundColor: currentColors.background}]}>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => {
                                assignIsNewGoalMenuVisible(false);
                                clearOptionsValues();
                            }}
                        >
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* Menu Title */}
                        <Text style={[styles.modalTitle, {color: currentColors.text}]}>إنشـاء ختمــة جديـدة</Text>
                        
                        {/* Menu Options */}
                        <View style={styles.menuOptionsContainer}>

                            {/* 1- Tilte Option */}
                            <View style={styles.optionContainer}>
                                <TextInput
                                    style={[styles.textInput, {borderColor: getOptionBorderColor(khtmaTitle), backgroundColor: currentColors.menuOptionBackground}]}
                                    placeholder='أدخل عنواناً'
                                    placeholderTextColor={currentColors.menuOptionPlaceholderText}
                                    width='85%'
                                    writingDirection='rtl'
                                    textAlign='center'
                                    value={khtmaTitle}
                                    onChangeText={(title) => setKhtmaTitle(title)}
                                />
                                <Text style={[styles.optionSubMenuLabel, {color: currentColors.text}]}>عنوان الختمة</Text>
                            </View>

                            {/* 2- Khtma Type Option */}
                            <View style={styles.optionContainer}>
                                <TouchableOpacity
                                        style={[styles.optionSubMenu, {borderColor: getOptionBorderColor(khtmaType), backgroundColor: currentColors.menuOptionBackground}]} 
                                        onPress={() => showSubMenu('khtmaType')}
                                >
                                    {
                                    (khtmaType !== null) ?
                                        <Text style={styles.optionSubMenuText}>{khtmaType.name}</Text>
                                        :
                                        <Text style={[styles.optionSubMenuText, {color: currentColors.menuOptionPlaceholderText}]}>تحديد</Text>
                                    }
                                </TouchableOpacity>
                                <Text style={[styles.optionSubMenuLabel, {color: currentColors.text}]}>نوع الختمة</Text>
                            </View>

                            {/* 3- Duration Option */}
                            <View style={styles.optionContainer}>
                                <TouchableOpacity
                                        style={[styles.optionSubMenu, {borderColor: getOptionBorderColor(khtmaDuration), backgroundColor: currentColors.menuOptionBackground}]} 
                                        onPress={() => showSubMenu('khtmaDuration')}
                                >
                                    {
                                    (khtmaDuration !== null) ?
                                        <Text style={styles.optionSubMenuText}>{khtmaDuration.name}</Text>
                                        :
                                        <Text style={[styles.optionSubMenuText, {color: currentColors.menuOptionPlaceholderText}]}>تحديد</Text>
                                    }
                                </TouchableOpacity>
                                <Text style={[styles.optionSubMenuLabel, {color: currentColors.text}]}>مدة الختمة</Text>
                            </View>

                            {/* 4- Reminder Time Option */}
                            <View style={styles.optionContainer}>
                                <TextInput
                                    style={[styles.textInput, {borderColor: getOptionBorderColor(khtmaReminderTime), backgroundColor: currentColors.menuOptionBackground}]}
                                    placeholder='أدخل توقيتاً'
                                    placeholderTextColor={currentColors.menuOptionPlaceholderText}
                                    width='85%'
                                    writingDirection='rtl'
                                    textAlign='center'
                                    value={khtmaReminderTime}
                                    onChangeText={(reminderTime) => setKhtmaReminderTime(reminderTime)}
                                />
                                <Text style={[styles.optionSubMenuLabel, {color: currentColors.text}]}>وقت التذكير</Text>
                            </View>
                            
                        </View>

                            {/* 5- Submit Button (to create khtma) */}
                            <TouchableOpacity onPress={() => createKhtma()}>
                                <Text style={styles.submitButton}>إنشــاء</Text>
                            </TouchableOpacity>

                    </View>
                </View>
            </Modal>
            {/*********************************************************************************/}

            {/****************** Sub-Settings (Options) Menu Modal (Sub-Menu) *****************/}
            <Modal
                visible={(isSubMenuVisible && selectedOption !== null)}
                transparent
                animationType="slide"
                onRequestClose={() => closeSubMenu()}
            >
                <View style={[styles.modalOverlay, {backgroundColor: currentColors.background}]}>
                    <View style={[styles.modalContainer, {backgroundColor: currentColors.background}]}>

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={() => closeSubMenu()}>
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* Sub-Menu Title */}
                        <Text style={[styles.modalTitle, {color: currentColors.text}]}>{subMenuTitle}</Text>

                        {/* Option Values (Sub-Menu Data) List */}
                        <FlatList
                            data={subMenuData}
                            keyExtractor={item => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => setOptionValue(item)}>
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
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
        opacity: 0.9,
    },
    modalContainer: {
        height: '50%',
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
    modalItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: PRIMARY_GOLD,
        borderRadius: 10,
        marginVertical: 5,
        color: PRIMARY_GOLD,
        direction: 'rtl',
        width: '100%'
    },
    modalItemText: {
        fontSize: 16,
        color: PRIMARY_GOLD,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    textInput: {
        flex: 0.79,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        fontSize: 15,
        color: PRIMARY_GOLD,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        height: 35
    },
    submitButton: {
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: DARK_GOLD,
        color: 'white',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 30
    },

    // Menu Modal (Settings Menu)
    menuOptionsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    optionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionSubMenu: {
        borderWidth: 1,
        borderRadius: 10,
        width: '55%',
        height: 35,
    },
    optionSubMenuText: {
        fontSize: 15,
        textAlign: 'center',
        color: PRIMARY_GOLD,
        padding: 5
    },
    optionSubMenuLabel: {
        fontSize: 15,
        textAlign: 'center',
        width: '35%'
    }
});