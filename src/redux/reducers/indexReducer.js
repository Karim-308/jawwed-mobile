const initialState = {
    indexType: 'Chapter',
    searchInput: ''
};


const actionTypes = {
    SET_INDEX_TYPE: 'SET_INDEX_TYPE',
    SET_SEARCH_INPUT: 'SET_SEARCH_INPUT',
};
  

export const setIndexType = (indexType) => ({
    type: actionTypes.SET_INDEX_TYPE,
    payload: indexType
});
export const setSearchInput = (searchInput) => ({
    type: actionTypes.SET_SEARCH_INPUT,
    payload: searchInput
});


const indexReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INDEX_TYPE:
      return { ...state, indexType: action.payload };
    case actionTypes.SET_SEARCH_INPUT:
      return { ...state, searchInput: action.payload };
    default:
      return state;
  }
};
  
export default indexReducer;
  