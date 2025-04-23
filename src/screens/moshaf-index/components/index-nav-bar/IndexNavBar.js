import React from 'react';
import { StyleSheet , View , TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import IndexTypeBar from '../index-type-bar/IndexTypeBar';
import { PRIMARY_GOLD } from '../../../../constants/colors';
import { goToScreenWithoutNestingInStack } from '../../../../utils/navigation-utils/NavigationUtils';


export default function IndexNavBar() {

    const navigation = useNavigation();

    return (
        <View style={styles.indexNavBar}>
            <View style={styles.indexTypeBar}>
                <IndexTypeBar />
            </View>       
            <TouchableOpacity
                style={styles.bookmarksButton}
                onPress={() => goToScreenWithoutNestingInStack(navigation, 'BookmarkPage')}
            >
                <Ionicons name='bookmark' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    indexNavBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indexTypeBar: {
        width: '90%'
    },
    bookmarksButton: {
        width: '10%'
    }
});