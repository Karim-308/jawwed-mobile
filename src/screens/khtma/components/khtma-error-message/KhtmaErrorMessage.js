import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import { useSelector , useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setErrorStatus } from '../../../../redux/reducers/khtmaReducer';
import { PRIMARY_GOLD } from '../../../../constants/colors';
import { get } from '../../../../utils/localStorage/secureStore';
import Colors from '../../../../constants/newColors';


export default function KhtmaErrorMessage() {

    const dispatch = useDispatch();

    const errorStatus = useSelector((state) => state.khtma.errorStatus);
    const assignErrorStatus = (errorStatus) => {
        dispatch(setErrorStatus(errorStatus));
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

            {/****************************** Error Message Modal ******************************/}
            <Modal
                visible={errorStatus !== null}
                transparent
                animationType="slide"
                onRequestClose={() => assignErrorStatus(null)}
            >
                <View style={[styles.modalOverlay, {backgroundColor: currentColors.background}]}>
                    <View style={[styles.modalContainer, {backgroundColor: currentColors.background}]}>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => assignErrorStatus(null)}
                        >
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* Menu Title */}
                        <Text style={[styles.modalTitle, {color: currentColors.text}]}>حدث خطأ ما</Text>
                        
                        {/* Error Message */}
                        <Text style={[styles.errorMessageText, {color: currentColors.text}]}>{errorStatus}</Text>

                    </View>
                </View>
            </Modal>
            {/*********************************************************************************/}

        </View>
    );
}


const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9
    },
    modalContainer: {
        height: '30%',
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PRIMARY_GOLD,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    errorMessageText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
        marginTop: 25
    },
    
});