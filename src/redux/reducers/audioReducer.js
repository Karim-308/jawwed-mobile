// redux/reducers/audioReducer.js
const initialState = {
    isPlaying: false,
    audioRepeat: false,
    audioPanelVisible: false,
  };
  
  const actionTypes = {
    TOGGLE_PLAY: 'TOGGLE_PLAY',
    TOGGLE_AUDIO_REPEAT: 'TOGGLE_AUDIO_REPEAT',
    TOGGLE_AUDIO_PANEL: 'TOGGLE_AUDIO_PANEL',
  };
  
  // Action Creators
  export const togglePlay = () => ({ type: actionTypes.TOGGLE_PLAY });
  export const toggleAudioRepeat = () => ({ type: actionTypes.TOGGLE_AUDIO_REPEAT });
  export const toggleAudioPanel = () => ({ type: actionTypes.TOGGLE_AUDIO_PANEL });
  
  const audioReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.TOGGLE_PLAY:
        return { ...state, isPlaying: !state.isPlaying };
      case actionTypes.TOGGLE_AUDIO_REPEAT:
        return { ...state, audioRepeat: !state.audioRepeat };
      case actionTypes.TOGGLE_AUDIO_PANEL:
        return { ...state, audioPanelVisible: !state.audioPanelVisible };
      default:
        return state;
    }
  };
  
  export default audioReducer;
  