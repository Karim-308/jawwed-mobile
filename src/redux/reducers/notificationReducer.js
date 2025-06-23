const initialState = {
  notificationsEnabled: false,
};

const actionTypes = {
  SET_NOTIFICATIONS_ENABLED: 'SET_NOTIFICATIONS_ENABLED',
};

export const setNotificationsEnabled = (enabled) => ({
  type: actionTypes.SET_NOTIFICATIONS_ENABLED,
  payload: enabled,
});

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_NOTIFICATIONS_ENABLED:
      return { ...state, notificationsEnabled: action.payload };
    default:
      return state;
  }
};

export default notificationReducer; 