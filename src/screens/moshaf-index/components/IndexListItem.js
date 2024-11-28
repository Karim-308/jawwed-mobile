import React from 'react';
import { StyleSheet , View , Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_GOLD } from '../../../constants/colors';


export default function IndexListItem({item}) {

    // To Do later
    const goTo = () => {
    }

    return (
        <View style={styles.indexListItem}>
          <View style={styles.indexListItemButtons}>
            <TouchableOpacity onPress={() => goTo}>
                <Ionicons name='information-circle-outline' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo}>
                <Ionicons name='play-outline' size={24} color={PRIMARY_GOLD} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.indexListItemTitle} onPress={() => goTo}>
                <Text style={styles.indexListItemName}>{item.name}</Text>
                <Text style={styles.indexListItemNumber}>{item.number}</Text>
          </TouchableOpacity>
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
    }
});