// redux/reducers/pageReducer.js
import {
  FETCH_PAGE_REQUEST,
  FETCH_PAGE_SUCCESS,
  FETCH_PAGE_FAILURE,
  SET_PAGE_NUMBER,
} from '../actions/pageActions';

import QuranPageParser from '../../utils/QuranPageParser';

const initialState = {
  pageNumber: 1,
  loading: false,
  data: {},  // Contains parsed page lines
  versesAudio: {},  // Stores audio for each ayah
  error: null,
};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
      case FETCH_PAGE_REQUEST:
          console.log('FETCH_PAGE_REQUEST dispatched - Loading started');
          // Set loading to true and clear any previous errors
          // This is dispatched when the page data is being fetched

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
              // If the page number or data is missing, return the current state
              // This is dispatched when the page data is successfully fetched
              console.error('FETCH_PAGE_SUCCESS received undefined page number or data');
              return state;
            }

            // Parse the page data
            const parsedData = QuranPageParser(action.payload.data);       
            return {
              // Update the state with the parsed data
              // data contains the parsed page lines
              ...state,
              loading: false,
              data: {
                ...state.data,
                [action.payload.pageNumber]: parsedData.linesData,  // Store parsed lines
              },
              versesAudio: {
                ...state.versesAudio,
                [action.payload.pageNumber]: parsedData.versesAudio,  // Store audio by page
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
