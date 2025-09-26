import store from '../../../../redux/store';
import { updateKhtma } from '../../../../api/khtma/updateGoal';
import { setDidGoalsChange } from '../../../../redux/reducers/khtmaReducer';

const getLastPageRead = () => {
  return store.getState().page.pageNumber;
}

const getSelectedGoal = () => {
  return store.getState().khtma.selectedGoal;
}

export const updateKhtmaProgress = async () => {
    const goalId = getSelectedGoal().goalId;
    const lastPageRead = getLastPageRead();
    const response = await updateKhtma(goalId, lastPageRead, "0");
    store.dispatch(setDidGoalsChange(true));
};