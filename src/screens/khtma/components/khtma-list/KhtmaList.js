import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setGoals, setDidGoalsChange, setErrorStatus } from '../../../../redux/reducers/khtmaReducer';
import KhtmaListItem from '../khtma-list-item/KhtmaListItem';
import { getAllGoals } from '../../../../api/khtma/getAllGoals';


export default function KhtmaList() {

    
    const dispatch = useDispatch();

    const goals = useSelector((state) => state.khtma.goals);
    const assignGoals = (goals) => {
        dispatch(setGoals(goals));
    }

    const didGoalsChange = useSelector((state) => state.khtma.didGoalsChange);
    const assignDidGoalsChange = (didGoalsChange) => {
        dispatch(setDidGoalsChange(didGoalsChange));
    }

    useEffect(() => {
        const fetchGoals = async () => {
            const goals = await getAllGoals();
            if (goals !== 'error')
                assignGoals(goals);
            else
                setErrorStatus('حدث خطأ أثناء عرض الختمات الحالية');
        };

        if(didGoalsChange) {
            fetchGoals();
            assignDidGoalsChange(false);
        }
    }, [didGoalsChange])
  
    return (
        <View style={styles.khtmaList}>
            <FlatList
                data={goals}
                keyExtractor={(goal) => goal.goalId}
                renderItem={({item}) => <KhtmaListItem goal={item} />}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    khtmaList: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 25
    }
});