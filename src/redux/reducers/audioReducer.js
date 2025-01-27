import { current } from "@reduxjs/toolkit";

// redux/reducers/audioReducer.js
const initialState = {
    isPlaying: false,
    isPaused: false,
    currentPlayingType: 'None',
    audioRepeat: false,
    audioPanelVisible: false,
    reciter: 'Alafasy', // Default reciter
    currentPlayingVerse: null
  };
  
  const actionTypes = {
    TOGGLE_PLAY: 'TOGGLE_PLAY',
    TOGGLE_PAUSE: 'TOGGLE_PAUSE',
    SET_CURRENT_PLAYING_TYPE: 'SET_CURRENT_PLAYING_TYPE',
    TOGGLE_AUDIO_REPEAT: 'TOGGLE_AUDIO_REPEAT',
    TOGGLE_AUDIO_PANEL: 'TOGGLE_AUDIO_PANEL',
    SET_RECITER: 'SET_RECITER',
    SET_CURRENT_PLAYING_VERSE: 'SET_CURRENT_PLAYING_VERSE'
  };
  
  // Action Creators
  export const togglePlay = () => ({ type: actionTypes.TOGGLE_PLAY });
  export const togglePause = () => ({ type: actionTypes.TOGGLE_PAUSE });
  export const setCurrentPlayingType = (type) => ({ type: actionTypes.SET_CURRENT_PLAYING_TYPE, payload: type});
  export const toggleAudioRepeat = () => ({ type: actionTypes.TOGGLE_AUDIO_REPEAT });
  export const toggleAudioPanel = () => ({ type: actionTypes.TOGGLE_AUDIO_PANEL });
  export const setReciter = (reciter) => ({ type: actionTypes.SET_RECITER, payload: reciter });
  export const setCurrentPlayingVerse = (verseKey) => ({ type: actionTypes.SET_CURRENT_PLAYING_VERSE, payload: verseKey });
  
  const audioReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.TOGGLE_PLAY:
        return { ...state, isPlaying: !state.isPlaying };
      case actionTypes.TOGGLE_PAUSE:
        return { ...state, isPaused: !state.isPaused };
      case actionTypes.SET_CURRENT_PLAYING_TYPE:
        return { ...state, currentPlayingType: action.payload };
      case actionTypes.TOGGLE_AUDIO_REPEAT:
        return { ...state, audioRepeat: !state.audioRepeat };
      case actionTypes.TOGGLE_AUDIO_PANEL:
        return { ...state, audioPanelVisible: !state.audioPanelVisible };
      case actionTypes.SET_RECITER:
        return { ...state, reciter: action.payload };
      case actionTypes.SET_CURRENT_PLAYING_VERSE:
        return { ...state, currentPlayingVerse: action.payload };  
      default:
        return state;
    }
  };
  
  export default audioReducer;
  
