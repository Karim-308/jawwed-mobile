// redux/reducers/pageReducer.js
import {
  FETCH_PAGE_REQUEST,
  FETCH_PAGE_SUCCESS,
  FETCH_PAGE_FAILURE,
  SET_PAGE_NUMBER,
} from '../actions/pageActions';

const initialState = {
  pageNumber: 1,
  loading: false,
  data: {}, // Store pages as key-value pairs for caching
  error: null,
};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
      case FETCH_PAGE_REQUEST:
          console.log('FETCH_PAGE_REQUEST dispatched - Loading started');
          return {
              ...state,
              loading: true,
              error: null,
          };
      
          case FETCH_PAGE_SUCCESS:
            console.log('FETCH_PAGE_SUCCESS received');
            console.log('Page Number:', action.payload.pageNumber);
            console.log('Data:', action.payload.data);
          
            if (!action.payload.pageNumber || !action.payload.data) {
              console.error('FETCH_PAGE_SUCCESS received undefined page number or data');
              return state;
            }
            
            return {
              ...state,
              loading: false,
              data: {
                ...state.data,
                [action.payload.pageNumber]: action.payload.data,
              },
            };
      
      case FETCH_PAGE_FAILURE:
          console.error('FETCH_PAGE_FAILURE dispatched');
          console.error('Error:', action.payload);
          return {
              ...state,
              loading: false,
              error: action.payload,
          };
      
      case SET_PAGE_NUMBER:
          console.log('SET_PAGE_NUMBER dispatched - New Page:', action.payload);
          return {
              ...state,
              pageNumber: action.payload,
          };
      
      default:
          return state;
  }
};

export default pageReducer;
