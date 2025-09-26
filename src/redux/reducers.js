// redux/reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import audioReducer from './reducers/audioReducer';
import navigationReducer from './reducers/navigationReducer';
import indexReducer from './reducers/indexReducer';
import pageReducer from './reducers/pageReducer';
import prayerTimesReducer from './reducers/prayerTimesReducer';
import khtmaReducer from './reducers/khtmaReducer';
import authReducer from './reducers/authReducer';
import darkModeReducer from './reducers/darkModeReducer'; // Import dark mode reducer
import notificationReducer from './reducers/notificationReducer'; // Add notification reducer
// Import other reducers as needed

const rootReducer = combineReducers({
  audio: audioReducer,
  navigation: navigationReducer,
  index: indexReducer,
  page: pageReducer,
  prayerTimes: prayerTimesReducer,
  khtma: khtmaReducer,
  auth: authReducer,
  darkMode: darkModeReducer, 
  notification: notificationReducer, // Add notification reducer here
  // Add other reducers here
});

export default rootReducer;
