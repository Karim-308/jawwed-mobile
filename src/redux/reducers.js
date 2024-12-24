// redux/reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import audioReducer from './reducers/audioReducer';
import navigationReducer from './reducers/navigationReducer';
import indexTypeReducer from './reducers/indexTypeReducer';
import pageReducer from './reducers/pageReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  audio: audioReducer,
  navigation: navigationReducer,
  indexType: indexTypeReducer,
  page: pageReducer,
  // Add other reducers here
});

export default rootReducer;
