import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../../constants/colors';
import { useDispatch } from 'react-redux';
import { setPageNumber } from '../../../../redux/actions/pageActions';
import { useNavigation } from '@react-navigation/native';
import { goToScreenWithoutNestingInStack } from '../../../../utils/navigation-utils/NavigationUtils';


export default function IndexListItem({item}) {

    // To Do later
    const goTo = () => {
    }

    // Navigate to a specific mushaf page
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const goToMoshafPage = (pageNumber) => {
      dispatch(setPageNumber(pageNumber));
      goToScreenWithoutNestingInStack(navigation, 'MoshafPage');
    }

    return (
      <TouchableOpacity onPress={() => goToMoshafPage(item.pageNumber)}>
        <View style={styles.indexListItem}>
          <View style={styles.indexListItemButtons}>
            <TouchableOpacity onPress={() => goTo}>
                <Ionicons name='information-circle-outline' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
          </View>
          <View style={styles.indexListItemTitle}>
            <Text style={styles.indexListItemName}>{item.name}</Text>
            <Text style={styles.indexListItemNumber}>{item.number}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    indexListItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#fff',
        marginVertical: 5
    },
    indexListItemButtons: {
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    indexListItemTitle: {
        flex: 0.85,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    indexListItemName: {
      fontSize: 20,
      color: '#fff',
      marginHorizontal: 10
    },
    indexListItemNumber: {
      fontSize: 25,
      color: `${PRIMARY_GOLD}`,
      marginHorizontal: 10
    }
});