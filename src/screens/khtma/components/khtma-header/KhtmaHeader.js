import React, { useState, useEffect } from 'react';
import { StyleSheet , View , TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setIsNewGoalMenuVisible } from '../../../../redux/reducers/khtmaReducer';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../../constants/colors';
import { get } from '../../../../utils/localStorage/secureStore';
import Colors from '../../../../constants/newColors';


export default function KhtmaHeader() {

    const dispatch = useDispatch();
    
    // New Goal Menu
    const assignIsNewGoalMenuVisible = (newGoalMenuVisible) => {
        dispatch(setIsNewGoalMenuVisible(newGoalMenuVisible));
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
        <View style={styles.KhtmaHeader}>

            {/*New Khtma Button*/}
            <TouchableOpacity
                onPress={() => assignIsNewGoalMenuVisible(true)}
            >
                <AntDesign name='pluscircleo' size={24} color={currentColors.text} />
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({
    KhtmaHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        right: '15%'
    },

});