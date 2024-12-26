// redux/reducers/navigationReducer.js
const initialState = {
    isVisible: false,
  };
  
  const actionTypes = {
    SHOW_NAV: 'SHOW_NAV',
    HIDE_NAV: 'HIDE_NAV',
  };
  
  // Action Creators
  export const showNav = () => ({ type: actionTypes.SHOW_NAV });
  export const hideNav = () => ({ type: actionTypes.HIDE_NAV });
  
  const navigationReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.SHOW_NAV:
        return { ...state, isVisible: true };
      case actionTypes.HIDE_NAV:
        return { ...state, isVisible: false };
      default:
        return state;
    }
  };
  
  export default navigationReducer;
  