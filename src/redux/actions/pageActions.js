import { fetchPage } from '../../api/mushaf/GetMushafPage';

// Action Types
export const FETCH_PAGE_REQUEST = 'FETCH_PAGE_REQUEST';
export const FETCH_PAGE_SUCCESS = 'FETCH_PAGE_SUCCESS';
export const FETCH_PAGE_FAILURE = 'FETCH_PAGE_FAILURE';
export const SET_PAGE_NUMBER = 'SET_PAGE_NUMBER';

// Action Creators

// Action Creator for Fetching Page Data Request
// This action creator is used to dispatch the loading state when fetching page data is requested 
export const fetchPageRequest = () => ({
  type: FETCH_PAGE_REQUEST,
});

// Action Creator for Fetching Page Data Success
// This action creator is used to dispatch the page data when fetching page data is successful
// This action creator is used to dispatch the page data when fetching page data is successful
export const fetchPageSuccess = (pageNumber, data) => {
  console.log('FETCH_PAGE_SUCCESS triggered for page:', pageNumber);
  //console.log('Data:', data);  // Log the raw data (array of lines)
  
  return {
    type: 'FETCH_PAGE_SUCCESS',
    payload: {
      pageNumber,   // Pass the page number explicitly
      data: data,   // Use the array directly as page data
    },
  };
};

// Action Creator for Fetching Page Data Failure
// This action creator is used to dispatch the error message when fetching page data fails
export const fetchPageFailure = (error) => ({
  type: FETCH_PAGE_FAILURE,
  payload: error,
});
 
// Action Creator for Setting the Page Number
// This action creator is used to set the current page number in the state
// This action is dispatched when the user navigates to a new page
export const setPageNumber = (pageNumber) => ({
  type: SET_PAGE_NUMBER,
  payload: pageNumber,
});

// Thunk Action Creator for Fetching Page Data
// This action creator fetches the page data from the API and dispatches the appropriate actions
export const fetchPageData = (pageNumber) => async (dispatch) => {
  dispatch(fetchPageRequest());
  try {
    const data = await fetchPage(pageNumber);
    //console.log('Page Data for Page:', pageNumber);
    dispatch(fetchPageSuccess(pageNumber, data));
  } catch (error) {
    dispatch(fetchPageFailure(error.message || 'Something went wrong.'));
  }
};
