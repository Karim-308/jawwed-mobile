import { Audio } from 'expo-av';
import store from '../../../redux/store';
import { togglePlay, togglePause, setCurrentPlayingVerse, setCurrentPlayingType } from '../../../redux/reducers/audioReducer';
import { setPageNumber } from '../../../redux/actions/pageActions';



const getIsPlaying = () => {
  return store.getState().audio.isPlaying;
}

const toggleIsPlaying = () => {
  store.dispatch(togglePlay());
}

const getIsPaused = () => {
  return store.getState().audio.isPaused;
}

const getCurrentPlayingType = () => {
  return store.getState().audio.currentPlayingType;
}

const toggleIsPaused = () => {
  store.dispatch(togglePause());
}

const IsLoading = () => {
  return store.getState().page.loading;
}

const changePageNumber = (pageNumber) => {
  store.dispatch(setPageNumber(pageNumber));
}


// the verse audio that you can play, stop, pause or resume
let verseAudio;
// the postition at which you paused at or resumed from
let position = null;

let nextVerseKey = null;
let currentPageNumber=null;
let endVerseKey = null;

// when true we go to the next page
let reachedEndOfPage = false;



// playing audio for multiple verses (two or more)
export const playAudioForMultipleVerses = (reciterName, pageNumber, startVerseKey=null, toVerseKey=null) => {

  if (!getIsPlaying() === false)
    toggleIsPlaying(); // isPlaying = ture

  // playing a range of verses
  if(toVerseKey !== null){
    store.dispatch(setCurrentPlayingType('Range'));
    endVerseKey = toVerseKey;
  }
  // playing all the verses
  else {
    store.dispatch(setCurrentPlayingType('All'));
  }

  currentPageNumber = pageNumber;

  // playing one verse at a time squentially until we finish the verses
  playAudioForOneVerse(reciterName, currentPageNumber, startVerseKey);
}

// playing audio for one verse
export const playAudioForOneVerse = async(reciterName, pageNumber, verseKey) => {

  if(getCurrentPlayingType() === 'None')
    store.dispatch(setCurrentPlayingType('Verse'));

  if(currentPageNumber === null)
    currentPageNumber = pageNumber;

  if (getIsPlaying() === false)
    toggleIsPlaying(); // isPlaying = ture
    
  // Set current playing verse before starting playback
  // This sets the playing verse in the redux store to highlight it in the UI
  if (verseKey !== null)
    store.dispatch(setCurrentPlayingVerse(verseKey));
  
  // get the URL then load the verse audio from the API
  const verseAudioUrl = await getVerseAudioURL(reciterName, verseKey);
  verseAudio = await loadVerseAudio(verseAudioUrl);

  // play the audio
  if(getIsPlaying() === true && getIsPaused() === false)
    await verseAudio.playAsync();

  verseAudio.setOnPlaybackStatusUpdate((status) => {

    // when the audio is done
    if(status.didJustFinish) {

      toggleIsPlaying(); // isPlaying = false
      if (getIsPaused() === true)
        toggleIsPaused();

      // continue to play the rest of the verses until the end of the mushaf
      if(getCurrentPlayingType() === 'All'){
        if(nextVerseKey === '114:6'){
          store.dispatch(setCurrentPlayingType('None'));
        }
        return playAudioForOneVerse(reciterName, currentPageNumber, nextVerseKey);
      }

      // continue to play the rest of the verses if we didn't reach the end verse
      else if (getCurrentPlayingType() === 'Range'){
        if(nextVerseKey === endVerseKey){
          store.dispatch(setCurrentPlayingType('None'));
        }
        return playAudioForOneVerse(reciterName, currentPageNumber, nextVerseKey);
      }

      // if it was just one verse audio or all the verses ended
      else {
        resetResources();
      }
    }
  });
}

// Pause the verse audio at a certain position
export const pauseAudio = async() => {
  if (getIsPlaying() === true && getIsPaused() === false) {
    toggleIsPaused();
    position = verseAudio.getStatusAsync().positionMillis;
    verseAudio.pauseAsync();
  }
}

// Resume the verse audio from the paused at position
export const resumeAudio = async() => {
  if (getIsPlaying() === true && getIsPaused() === true) {
    toggleIsPaused();
    verseAudio.playFromPositionAsync(position);
  }
}

// Stop the verse audio
export const stopAudio = async() => {
  if (getIsPlaying() === true) {
    toggleIsPlaying();
    if (getIsPaused() === true)
      toggleIsPaused();
    verseAudio.stopAsync();
    resetResources();
  }
}

// reset and clear the unused resources
const resetResources = () => {
  verseAudio.unloadAsync();
  store.dispatch(setCurrentPlayingType('None'));
  store.dispatch(setCurrentPlayingVerse(null));
  position = null;
  endVerseKey = null;
  nextVerseKey = null;
  currentPageNumber=null;
  reachedEndOfPage = false;
}



// get the verse audio url from the API response
const getVerseAudioURL = async(reciterName, verseKey) => {

  // if we reached the end of the page you need to go to next page and load the new audio urls
  if(reachedEndOfPage === true || verseKey === null){
    const verseAudioUrl = await getFirstVerseAudioURLInPage(reciterName, currentPageNumber);
    return verseAudioUrl;
  }
  else {
    // get the all the audio urls for the current page
    const versesAudioUrls = store.getState().page.versesAudio;
    const versesAudioUrlsPerPage = versesAudioUrls[`${currentPageNumber}`];

    // get the audio for the specific verse you want in the page
    for (let i=0; i<versesAudioUrlsPerPage.length; i++){
      if(versesAudioUrlsPerPage[i]['verseKey'] === verseKey){
        
        if(i<versesAudioUrlsPerPage.length-1){
          // prepare the next verse key in the next play audio iteration (if needed)
          nextVerseKey = versesAudioUrlsPerPage[i+1]['verseKey'];
        }
        else{
          reachedEndOfPage = true;
        }

        // get the audio for the specific reciter that was chosen
        const versesAudioUrlsPerVerse = versesAudioUrlsPerPage[i]['audio'];
        for(let j=0; j<versesAudioUrlsPerVerse.length; j++){
          if(versesAudioUrlsPerVerse[j].match(`${reciterName}`)){
            return versesAudioUrlsPerVerse[j];
          }
        }
      }
    }
  }
}

// go to the next page when needed
const getFirstVerseAudioURLInPage = (reciterName) => {

  // go to the next page
  if(reachedEndOfPage === true){
    // go to the next page
    currentPageNumber++;
    changePageNumber(currentPageNumber);
    reachedEndOfPage = false;
  }

  // get the audio url for the first verse in the current page
  return new Promise((resolve) => {
    // wait until the new audio urls have loaded from the API
    const intervalId = setInterval(()=> {
      // when the loading is done
      if(IsLoading() === false) {
        clearInterval(intervalId);
        // get the all the audio urls for the current page
        const versesAudioUrls = store.getState().page.versesAudio;
        const versesAudioUrlsPerPage = versesAudioUrls[`${currentPageNumber}`];

        // Set the current playing verse to the first verse of the new page
        store.dispatch(setCurrentPlayingVerse(versesAudioUrlsPerPage[0]['verseKey']));

        // prepare the next verse key in the next play audio iteration (if needed)
        nextVerseKey = versesAudioUrlsPerPage[1]['verseKey'];

        // get the audio for the specific reciter that was chosen
        const versesAudioUrlsPerVerse = versesAudioUrlsPerPage[0]['audio'];
        for(let j=0; j<versesAudioUrlsPerVerse.length; j++){
          if(versesAudioUrlsPerVerse[j].match(`${reciterName}`)){
            resolve(versesAudioUrlsPerVerse[j]);
          }
        }
      }
    }, 200);
  });
}

// Loading the verse audio from the remote API
const loadVerseAudio = async(verseAudioURL) => {
  try{
    const {sound} = await Audio.Sound.createAsync(
      {uri: verseAudioURL}
    );
    return sound;
  }
  catch(error) {
    console.error('Error occured while loading the audio',  error);
  }
}