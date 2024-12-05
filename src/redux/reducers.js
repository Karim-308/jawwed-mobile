// redux/reducers.js
const initialState = {
  isPlaying: false,
  isVisible: true,

  audioRepeat: false,
  audioPanelVisibile: false,


  mushafIndexType: 'Chapter'
};

const actionTypes = {
  TOGGLE_PLAY: 'TOGGLE_PLAY',
  SHOW_NAV: 'SHOW_NAV',
  HIDE_NAV: 'HIDE_NAV',

  TOGGLE_AUDIO_REPEAT: 'TOGGLE_AUDIO_REPEAT',
  TOGGLE_AUDIO_PANEL: 'TOGGLE_AUDIO_PANEL',


  ACTIVATE_JUZ_INDEX_TYPE: 'CHANGE_INDEX_TYPE_TO_JUZ',
  ACTIVATE_CHAPTER_INDEX_TYPE: 'CHANGE_INDEX_TYPE_TO_CHAPTER'
};



export const togglePlay = () => ({ type: actionTypes.TOGGLE_PLAY });
export const showNav = () => ({ type: actionTypes.SHOW_NAV });
export const hideNav = () => ({ type: actionTypes.HIDE_NAV });

export const toggleAudioRepeat = () => ({ type: actionTypes.TOGGLE_AUDIO_REPEAT });
export const toggleAudioPanel = () => ({ type: actionTypes.TOGGLE_AUDIO_PANEL });


export const activateJuzIndexType = () => ({ type: actionTypes.ACTIVATE_JUZ_INDEX_TYPE });
export const activateChapterIndexType = () => ({ type: actionTypes.ACTIVATE_CHAPTER_INDEX_TYPE });



const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying };
    case actionTypes.SHOW_NAV:
      return { ...state, isVisible: true };
    case actionTypes.HIDE_NAV:
      return { ...state, isVisible: false };

    case actionTypes.TOGGLE_AUDIO_REPEAT:
      return { ...state, audioRepeat: !state.audioRepeat };
    case actionTypes.TOGGLE_AUDIO_PANEL:
      return { ...state, audioPanelVisibile: !state.audioPanelVisibile };


    case actionTypes.ACTIVATE_JUZ_INDEX_TYPE:
      return { ...state, mushafIndexType: 'Juz'};
    case actionTypes.ACTIVATE_CHAPTER_INDEX_TYPE:
      return { ...state, mushafIndexType: 'Chapter'};

    default:
      return state;
  }
};

export default rootReducer;
