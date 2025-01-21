import React from 'react';
import { StyleSheet , View , Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../constants/colors';
import { useDispatch } from 'react-redux';
import { setPageNumber } from '../../../redux/actions/pageActions';
import { useNavigation } from '@react-navigation/native';


export default function IndexListItem({item}) {

    // To Do later
    const goTo = () => {
    }

    // Navigate to a specific mushaf page
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const goToMoshafPage = (pageNumber) => {
      dispatch(setPageNumber(pageNumber));
      navigation.navigate('MoshafPage')
    }

    return (
        <View style={styles.indexListItem}>
          <View style={styles.indexListItemButtons}>
            <TouchableOpacity onPress={() => goTo}>
                <Ionicons name='information-circle-outline' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToMoshafPage(item.pageNumber)}>
                <Text style={styles.goToButton}>اذهب إلى</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.indexListItemTitle}>
            <Text style={styles.indexListItemName}>{item.name}</Text>
            <Text style={styles.indexListItemNumber}>{item.number}</Text>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    indexListItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
    },
    indexListItemButtons: {
        flexGrow: 0.25,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    indexListItemTitle: {
        flex: 1,
        flexGrow: 0.75,
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
    },
    goToButton: {
      fontSize: 15,
      color: 'white',
      borderStyle: 'solid',
      borderColor: `#DE9953`,
      borderWidth: 1,
      borderRadius: 5,
      padding: 5,
      backgroundColor: `#DE9953`,
      marginLeft: 10,
    }
});