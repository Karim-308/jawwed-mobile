// redux/reducers/indexTypeReducer.js
const initialState = {
    mushafIndexType: 'Chapter',
  };
  
  const actionTypes = {
    ACTIVATE_JUZ_INDEX_TYPE: 'CHANGE_INDEX_TYPE_TO_JUZ',
    ACTIVATE_CHAPTER_INDEX_TYPE: 'CHANGE_INDEX_TYPE_TO_CHAPTER',
  };
  
  // Action Creators
  export const activateJuzIndexType = () => ({ type: actionTypes.ACTIVATE_JUZ_INDEX_TYPE });
  export const activateChapterIndexType = () => ({ type: actionTypes.ACTIVATE_CHAPTER_INDEX_TYPE });
  
  const indexTypeReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.ACTIVATE_JUZ_INDEX_TYPE:
        return { ...state, mushafIndexType: 'Juz' };
      case actionTypes.ACTIVATE_CHAPTER_INDEX_TYPE:
        return { ...state, mushafIndexType: 'Chapter' };
      default:
        return state;
    }
  };
  
  export default indexTypeReducer;
  