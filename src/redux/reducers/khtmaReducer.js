const initialState = {
    isNewGoalMenuVisible: false,
    isGoalViewVisible: false,
    goals: {},
    selectedGoal: {},
    selectedGoalData: {},
    selectedDay: {},
    didGoalsChange: true,
    errorStatus: null
};


const actionTypes = {
    SET_IS_NEW_GOAL_MENU_VISIBLE: 'SET_IS_NEW_GOAL_MENU_VISIBLE',
    SET_IS_GOAL_VIEW_VISIBLE: 'SET_IS_GOAL_VIEW_VISIBLE',
    SET_GOALS: 'SET_GOALS',
    SET_SELECTED_GOAL: 'SET_SELECTED_GOAL',
    SET_SELECTED_GOAL_DATA: 'SET_SELECTED_GOAL_DATA',
    SET_SELECTED_DAY: 'SET_SELECTED_DAY',
    SET_DID_GOALS_CHANGE: 'SET_DID_GOALS_CHANGE',
    SET_ERROR_STATUS: 'SET_ERROR_STATUS'
};


export const setIsNewGoalMenuVisible = (isNewGoalMenuVisible) => ({
    type: actionTypes.SET_IS_NEW_GOAL_MENU_VISIBLE,
    payload: isNewGoalMenuVisible
});
export const setIsGoalViewVisible = (isGoalViewVisible) => ({
    type: actionTypes.SET_IS_GOAL_VIEW_VISIBLE,
    payload: isGoalViewVisible
});
export const setGoals = (goals) => ({
    type: actionTypes.SET_GOALS,
    payload: goals
});
export const setSelectedGoal = (selectedGoal) => ({
    type: actionTypes.SET_SELECTED_GOAL,
    payload: selectedGoal
});
export const setSelectedGoalData = (selectedGoalData) => ({
    type: actionTypes.SET_SELECTED_GOAL_DATA,
    payload: selectedGoalData
});
export const setSelectedDay = (selectedDay) => ({
    type: actionTypes.SET_SELECTED_DAY,
    payload: selectedDay
});
export const setDidGoalsChange = (didGoalsChange) => ({
    type: actionTypes.SET_DID_GOALS_CHANGE,
    payload: didGoalsChange
});
export const setErrorStatus = (errorStatus) => ({
    type: actionTypes.SET_ERROR_STATUS,
    payload: errorStatus
});


const khtmaReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_IS_NEW_GOAL_MENU_VISIBLE:
            return { ...state, isNewGoalMenuVisible: action.payload };
        case actionTypes.SET_IS_GOAL_VIEW_VISIBLE:
            return { ...state, isGoalViewVisible: action.payload };
        case actionTypes.SET_GOALS:
            return { ...state, goals: action.payload };
        case actionTypes.SET_SELECTED_GOAL:
            return { ...state, selectedGoal: action.payload };
        case actionTypes.SET_SELECTED_GOAL_DATA:
            return { ...state, selectedGoalData: action.payload };
        case actionTypes.SET_SELECTED_DAY:
            return { ...state, selectedDay: action.payload };
        case actionTypes.SET_DID_GOALS_CHANGE:
            return { ...state, didGoalsChange: action.payload };
        case actionTypes.SET_ERROR_STATUS:
            return { ...state, errorStatus: action.payload };
        default:
            return state;
    }
};


export default khtmaReducer;
  