// redux/reducers.js
const initialState = {
  isPlaying: false,
  isVisible: true,
    
  // for Mushaf Index Screen
  mushafIndexType: 'Chapter'
};

const actionTypes = {
  TOGGLE_PLAY: 'TOGGLE_PLAY',
  SHOW_NAV: 'SHOW_NAV',
  HIDE_NAV: 'HIDE_NAV',
    
  // for Mushaf Index Screen
  ACTIVATE_JUZ_INDEX_TYPE: 'CHANGE_INDEX_TYPE_TO_JUZ',
  ACTIVATE_CHAPTER_INDEX_TYPE: 'CHANGE_INDEX_TYPE_TO_CHAPTER'
};

export const togglePlay = () => ({ type: actionTypes.TOGGLE_PLAY });
export const showNav = () => ({ type: actionTypes.SHOW_NAV });
export const hideNav = () => ({ type: actionTypes.HIDE_NAV });

// for Mushaf Index Screen
export const activateJuzIndexType = () => ({ type: actionTypes.ACTIVATE_JUZ_INDEX_TYPE });
export const activateChapterIndexType = () => ({ type: actionTypes.ACTIVATE_CHAPTER_INDEX_TYPE });

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying };
    case actionTypes.SHOW_NAV:
      return { ...state, isVisible: true };
    case actionTypes.HIDE_NAV:
      return { ...state, isVisible: false };
          
    // for Mushaf Index Screen
    case actionTypes.ACTIVATE_JUZ_INDEX_TYPE:
      return { ...state, mushafIndexType: 'Juz'};
    case actionTypes.ACTIVATE_CHAPTER_INDEX_TYPE:
      return { ...state, mushafIndexType: 'Chapter'};

    default:
      return state;
  }
};

export default rootReducer;
