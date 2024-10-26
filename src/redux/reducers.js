// redux/reducers.js
const initialState = {
    isPlaying: false,
    isVisible: true,
  };
  
  const actionTypes = {
    TOGGLE_PLAY: 'TOGGLE_PLAY',
    SHOW_NAV: 'SHOW_NAV',
    HIDE_NAV: 'HIDE_NAV',
  };
  
  export const togglePlay = () => ({ type: actionTypes.TOGGLE_PLAY });
  export const showNav = () => ({ type: actionTypes.SHOW_NAV });
  export const hideNav = () => ({ type: actionTypes.HIDE_NAV });
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.TOGGLE_PLAY:
        return { ...state, isPlaying: !state.isPlaying };
      case actionTypes.SHOW_NAV:
        return { ...state, isVisible: true };
      case actionTypes.HIDE_NAV:
        return { ...state, isVisible: false };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  