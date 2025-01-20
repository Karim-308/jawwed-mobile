// redux/reducers/audioReducer.js
const initialState = {
    isPlaying: false,
    isPaused: false,
    audioRepeat: false,
    audioPanelVisible: false,
    reciter: 'Alafasy', // Default reciter
  };
  
  const actionTypes = {
    TOGGLE_PLAY: 'TOGGLE_PLAY',
    TOGGLE_PAUSE: 'TOGGLE_PAUSE',
    TOGGLE_AUDIO_REPEAT: 'TOGGLE_AUDIO_REPEAT',
    TOGGLE_AUDIO_PANEL: 'TOGGLE_AUDIO_PANEL',
    SET_RECITER: 'SET_RECITER',
  };
  
  // Action Creators
  export const togglePlay = () => ({ type: actionTypes.TOGGLE_PLAY });
  export const togglePause = () => ({ type: actionTypes.TOGGLE_PAUSE });
  export const toggleAudioRepeat = () => ({ type: actionTypes.TOGGLE_AUDIO_REPEAT });
  export const toggleAudioPanel = () => ({ type: actionTypes.TOGGLE_AUDIO_PANEL });
  export const setReciter = (reciter) => ({ type: actionTypes.SET_RECITER, payload: reciter });
  
  
  const audioReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.TOGGLE_PLAY:
        return { ...state, isPlaying: !state.isPlaying };
      case actionTypes.TOGGLE_PAUSE:
        return { ...state, isPaused: !state.isPaused };
      case actionTypes.TOGGLE_AUDIO_REPEAT:
        return { ...state, audioRepeat: !state.audioRepeat };
      case actionTypes.TOGGLE_AUDIO_PANEL:
        return { ...state, audioPanelVisible: !state.audioPanelVisible };
      case actionTypes.SET_RECITER:
        return { ...state, reciter: action.payload };
      default:
        return state;
    }
  };
  
  export default audioReducer;
  
