import { fetchPage } from '../../api/mushaf/GetMushafPage';

// Action Types
export const FETCH_PAGE_REQUEST = 'FETCH_PAGE_REQUEST';
export const FETCH_PAGE_SUCCESS = 'FETCH_PAGE_SUCCESS';
export const FETCH_PAGE_FAILURE = 'FETCH_PAGE_FAILURE';
export const SET_PAGE_NUMBER = 'SET_PAGE_NUMBER';

// Action Creators
export const fetchPageRequest = () => ({
  type: FETCH_PAGE_REQUEST,
});

export const fetchPageSuccess = (pageNumber, data) => {
  console.log('FETCH_PAGE_SUCCESS triggered for page:', pageNumber);
  console.log('Data:', data);  // Log the raw data (array of lines)
  
  return {
    type: 'FETCH_PAGE_SUCCESS',
    payload: {
      pageNumber,   // Pass the page number explicitly
      data: data,   // Use the array directly as page data
    },
  };
};


export const fetchPageFailure = (error) => ({
  type: FETCH_PAGE_FAILURE,
  payload: error,
});

export const setPageNumber = (pageNumber) => ({
  type: SET_PAGE_NUMBER,
  payload: pageNumber,
});

// Thunk Action Creator for Fetching Page Data
export const fetchPageData = (pageNumber) => async (dispatch) => {
  dispatch(fetchPageRequest());
  try {
    const data = await fetchPage(pageNumber);
    console.log('Page Data for Page:', pageNumber);
    dispatch(fetchPageSuccess(pageNumber, data));
  } catch (error) {
    dispatch(fetchPageFailure(error.message || 'Something went wrong.'));
  }
};
