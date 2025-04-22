import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Coordinates } from 'adhan';
import { setCountry, setCity, setCoordinates, setCalculationMethod, setMazhab, setLocationDeterminationMethod,setIsSettingsMenuVisible, setErrorStatus } from '../../../../redux/reducers/prayerTimesReducer';
import { coordinatesOptionData, calculationMethodOptionData, mazhabOptionData } from '../PrayerTimesData';
import { getLocationBackgroundColor, getOptionBorderColor } from './PrayerTimesSettingsMenuFunctions';
import { PRIMARY_GOLD, DARK_GREY } from '../../../../constants/colors';
import { getCurrentCoordinates } from '../../../../utils/location-utils/LocationUtils';


export default function PrayerTimesSettingsMenu() {

    const dispatch = useDispatch();
    
    // Settings Menu
    const isSettingsMenuVisible = useSelector((state) => state.prayerTimes.isSettingsMenuVisible);
    const assignIsSettingsMenuVisible = (settingsMenuVisible) => {
        dispatch(setIsSettingsMenuVisible(settingsMenuVisible));
    }

    const [isDefualtOptionsActivated, setIsDefualtOptionsActivated] = useState(false);

    // Subsettings Menu (option menu)
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [subMenuTitle, setSubMenuTitle] = useState(null);
    const [subMenuData, setSubMenuData] = useState(null);

    // Menu options values
    const [locationLevel, setLocationLevel] = useState(null);
    const [tempSelectedCountry, setTempSelectedCountry] = useState(null);

    const locationDeterminationMethod = useSelector((state) => state.prayerTimes.locationDeterminationMethod);
    const assignLocationDeterminationMethod = (locationDeterminationMethod) => {
        dispatch(setLocationDeterminationMethod(locationDeterminationMethod));
    }

    const country = useSelector((state) => state.prayerTimes.country);
    const assignCountry = (country) => {
        dispatch(setCountry(country));
    }

    const city = useSelector((state) => state.prayerTimes.city);
    const assignCity = (city) => {
        dispatch(setCity(city));
    }
    
    const mazhab = useSelector((state) => state.prayerTimes.mazhab);
    const assignMazhab = (mazhab) => {
        dispatch(setMazhab(mazhab));
    }

    const calculationMethod = useSelector((state) => state.prayerTimes.calculationMethod);
    const assignCalculationMethod = (calculationMethod) => {
        dispatch(setCalculationMethod(calculationMethod));
    }

    const assignCoordinates = (coordinates) => {
        dispatch(setCoordinates(coordinates));
    }

    const assignErrorStatus = (errorStatus) => {
        dispatch(setErrorStatus(errorStatus));
    }


    // Setting the correct location sub-menu data (either city or country)
    useEffect(() => {
        if (locationLevel !== null)
            setLocationSubMenuData();
    }, [locationLevel]);

    
    // Show options sub-menus when selected
    const showSubMenu = (optionSelected) => {

        if(optionSelected === 'Location') {
            if (locationLevel === null)
                setLocationLevel('Country');
            else if (locationLevel === 'Country')
                setLocationLevel('City');

            // `setLocationSubMenuData()` will be invoked after `locationLevel` is set
        }
        else if(optionSelected === 'CalcMethod')
            setCalcMethodSubMenuData();
        else if(optionSelected === 'Mazhab')
            setMazhabSubMenuData();

        if (isSubMenuVisible === false) {
            setSelectedOption(optionSelected);
            setIsSubMenuVisible(true);
        }
    }

    // Close options sub-menus
    const closeSubMenu = () => {
        setIsSubMenuVisible(false);
        setSelectedOption(null);
        setLocationLevel(null);
    }

    // Go back from a inner sub-menu to outer sub-menu (city sub-menu --> country sub-menu)
    const goBackToPrevSubMenu = () => {
        if(selectedOption === 'Location' && locationLevel === 'City') {
            setLocationLevel('Country');
            // `setLocationSubMenuData()` will be invoked after `locationLevel` is set
        }
    }


    // Prepare the sub-menu data that will be displayed
    const setLocationSubMenuData = () => {
        if (locationLevel === 'Country') {
            setSubMenuTitle('اختر الدولـة');
            setSubMenuData(Object.keys(coordinatesOptionData));
        }
        else if (locationLevel === 'City') {
            setSubMenuTitle('اختر المدينة');
            setSubMenuData(Object.keys(coordinatesOptionData[tempSelectedCountry]));
        }
    }
    const setCalcMethodSubMenuData = () => {
        setSubMenuTitle('اختر طريقة الحساب');
        setSubMenuData(calculationMethodOptionData);
    }
    const setMazhabSubMenuData = () => {
        setSubMenuTitle('اختر المذهـب');
        setSubMenuData(mazhabOptionData);
    }

    // Set option to the selected value
    const setOptionValue = (item) => {
        if(selectedOption === 'Location') {
            if(locationLevel === 'Country') {
                setTempSelectedCountry(item);
                showSubMenu('Location');
            }
            else if (locationLevel === 'City') {
                assignCountry(tempSelectedCountry);
                assignCity(item);
                closeSubMenu();
                // `updateCoordinates()` will be invoked after `city` is set
            }
        }
        else if(selectedOption === 'CalcMethod') {
            assignCalculationMethod(item);
            closeSubMenu();
            // `setCalcMethodParam()` will be invoked after `calculationMethod` is set
        }
        else if(selectedOption === 'Mazhab') {
            assignMazhab(item);
            closeSubMenu();
            // `setMazhabParam()` will be invoked after `mazhab` is set
        }

    }

    // Updating the coordinates
    useEffect(() => {
        if(city !== null)
            updateCoordinates();
    }, [city]);
    
    const updateCoordinates = () => {
        const selectedCoordinates = coordinatesOptionData[country][city];
        assignCoordinates(new Coordinates(selectedCoordinates.latitude, selectedCoordinates.longitude));
        assignLocationDeterminationMethod('Manual');
    }

    const detectCurrentCoordinates = async () => {

        const location = await getCurrentCoordinates();

        // if no errors occured while getting the location permission and coordinates
        if(location.coordinates !== null) {
            const detectedCoordinates = new Coordinates(location.coordinates.latitude, location.coordinates.longitude);
            assignCountry(null);
            assignCity(null);
            assignCoordinates(detectedCoordinates);
            assignLocationDeterminationMethod('Auto');
        }
        // if errors occured
        else {
            assignErrorStatus(location.errorStatus);
        }
    }

    // Set the default values for all the settings options
    const setDefaultSettings = async () => {
        await detectCurrentCoordinates();
        assignMazhab('شافعي');
        assignCalculationMethod('مكة - أم القرى');
        setIsDefualtOptionsActivated(true);
    }

    // Stop the default values when the user choses a value
    // to allow the user to chose the default values again
    useEffect(() => {
        const stopDefaultOptions = () => {
            if(locationDeterminationMethod !== 'Auto' || mazhab !== 'شافعي' || calculationMethod !== 'مكة - أم القرى') {
                setIsDefualtOptionsActivated(false);
            }
        }
        if(setIsDefualtOptionsActivated && mazhab && calculationMethod)
            stopDefaultOptions();
    }, [locationDeterminationMethod, mazhab, calculationMethod]);


    return (
        <View>

            {/****************************** Settings Menu Modal ******************************/}
            <Modal
                visible={isSettingsMenuVisible}
                transparent
                animationType="slide"
                onRequestClose={() => assignIsSettingsMenuVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => assignIsSettingsMenuVisible(false)}
                        >
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* Menu Title */}
                        <Text style={styles.modalTitle}>الإعـــدادات</Text>
                        
                        {/* Menu Options */}
                        <View style={styles.menuOptionsContainer}>

                            {/* 1- Location Option */}
                            <View style={styles.optionContainer}>
                                <TouchableOpacity
                                    style={[styles.autoLocateButton, {backgroundColor: getLocationBackgroundColor(locationDeterminationMethod)}]}
                                    onPress={() => {
                                        if(locationDeterminationMethod !== 'Auto') {
                                            detectCurrentCoordinates();
                                        }
                                        else {
                                            assignLocationDeterminationMethod(null);
                                            assignCoordinates(null);
                                        }
                                    }}
                                >
                                    <MaterialIcons name="my-location" size={30} color={'#fff'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.optionSubMenu, {borderColor: getOptionBorderColor(locationDeterminationMethod)}]}
                                    onPress={() => {
                                        if(locationDeterminationMethod !== 'Auto')
                                            showSubMenu('Location');
                                    }}
                                >
                                    {
                                    (locationDeterminationMethod === 'Manual')?
                                        <Text style={styles.optionSubMenuText}>{country} - {city}</Text>
                                        :(locationDeterminationMethod === 'Auto')?
                                            <Text style={styles.optionSubMenuText}>تم التحديد تلقائياً</Text>
                                            :
                                            <Text style={styles.optionSubMenuText}>تحديد</Text>
                                    }
                                </TouchableOpacity>
                                <Text style={styles.optionSubMenuLabel}>الموقع</Text>
                            </View>

                            {/* 2- Calculation Method Option */}
                            <View style={styles.optionContainer}>
                                    <TouchableOpacity
                                    style={[styles.optionSubMenu, {borderColor: getOptionBorderColor(calculationMethod)}]} 
                                    onPress={() => showSubMenu('CalcMethod')}
                            >
                                {
                                (calculationMethod !== null) ?
                                    <Text style={styles.optionSubMenuText}>{calculationMethod}</Text>
                                    :
                                    <Text style={styles.optionSubMenuText}>تحديد</Text>
                                }
                                </TouchableOpacity>
                                <Text style={styles.optionSubMenuLabel}>طريقة الحساب</Text>
                            </View>

                            {/* 3- Mazhab (Asr Time Calculation Method) Option */}
                            <View style={styles.optionContainer}>
                                <TouchableOpacity
                                    style={[styles.optionSubMenu, {borderColor: getOptionBorderColor(mazhab)}]}
                                    onPress={() => showSubMenu('Mazhab')}
                                >
                                {
                                (mazhab !== null) ?
                                    <Text style={styles.optionSubMenuText}>{mazhab}</Text>
                                    :
                                    <Text style={styles.optionSubMenuText}>تحديد</Text>
                                }
                                </TouchableOpacity>
                                <Text style={styles.optionSubMenuLabel}>المذهب</Text>
                            </View>
                        </View>

                        {/* Button to set options to defaults*/
                        (!isDefualtOptionsActivated)?
                            <TouchableOpacity onPress={() => setDefaultSettings()}>
                                <Text
                                    style={[styles.defaultsButton, {backgroundColor: '#DE9953'}]}
                                >تطبيق الوضع الافتراضي</Text>
                            </TouchableOpacity>
                            :
                            <Text
                                style={[styles.defaultsButton, {backgroundColor: `#CCC`}]}
                            >تم تطبيق الوضع الافتراضي</Text>
                        }
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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Show a back-arrow button to return back if you go to a sub-menu inside a sub-menu */}
                        {(locationLevel === 'City')?
                            <TouchableOpacity style={styles.backButton} onPress={() => goBackToPrevSubMenu()}>
                                <Ionicons name="arrow-back-circle-outline" size={30} color={PRIMARY_GOLD} />
                            </TouchableOpacity>
                            :
                            <></>
                        }

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={() => closeSubMenu()}>
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* Sub-Menu Title */}
                        <Text style={styles.modalTitle}>{subMenuTitle}</Text>

                        {/* Option Values (Sub-Menu Data) List */}
                        <FlatList
                            data={subMenuData}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => setOptionValue(item)}>
                                    <Text style={styles.modalItemText}>{item}</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        height: '50%',
        width: '80%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PRIMARY_GOLD,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    modalItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#FFF',
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
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    defaultsButton: {
        fontSize: 16,
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
    autoLocateButton: {
        borderStyle: 'solid',
        borderRadius: 10,
        padding: 2
    },
    optionSubMenu: {
        backgroundColor: DARK_GREY,
        borderWidth: 1,
        borderRadius: 10,
        padding: 2,
        width: '50%',
        margin: 5
    },
    optionSubMenuText: {
        fontSize: 15,
        textAlign: 'center',
        color: PRIMARY_GOLD,
        margin: 5
    },
    optionSubMenuLabel: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        width: '25%'
    }
});