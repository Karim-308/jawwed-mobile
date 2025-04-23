// redux/reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import audioReducer from './reducers/audioReducer';
import navigationReducer from './reducers/navigationReducer';
import indexReducer from './reducers/indexReducer';
import pageReducer from './reducers/pageReducer';
import prayerTimesReducer from './reducers/prayerTimesReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  audio: audioReducer,
  navigation: navigationReducer,
  index: indexReducer,
  page: pageReducer,
  prayerTimes: prayerTimesReducer
  // Add other reducers here
});

export default rootReducer;
