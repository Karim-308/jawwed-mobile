import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import { useSelector , useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setErrorStatus } from '../../../../redux/reducers/prayerTimesReducer';
import { PRIMARY_GOLD } from '../../../../constants/colors';


export default function PrayerTimesErrorMessage() {

    const dispatch = useDispatch();

    const errorStatus = useSelector((state) => state.prayerTimes.errorStatus);
    const assignErrorStatus = (errorStatus) => {
        dispatch(setErrorStatus(errorStatus));
    }

    
    return (
        <View>

            {/****************************** Error Message Modal ******************************/}
            <Modal
                visible={errorStatus !== null}
                transparent
                animationType="slide"
                onRequestClose={() => assignErrorStatus(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => assignErrorStatus(null)}
                        >
                            <Ionicons name="close-circle-outline" size={30} color={PRIMARY_GOLD} />
                        </TouchableOpacity>

                        {/* Menu Title */}
                        <Text style={styles.modalTitle}>حدث خطأ ما</Text>
                        
                        {/* Error Message */}
                        <Text style={styles.errorMessageText}>{errorStatus}</Text>

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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        height: '30%',
        width: '80%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
        color: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    errorMessageText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFF',
        margin: 10,
        marginTop: 25
    },
    
});