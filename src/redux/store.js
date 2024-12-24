// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Ensure the path is correct

const store = configureStore({
  reducer: rootReducer,
  // Middleware is included by default (including thunk)
  // Redux DevTools are enabled by default in development
});

export default store;
