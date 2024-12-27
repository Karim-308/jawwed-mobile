import { Audio } from 'expo-av';
import store from '../../../redux/store';
import { togglePlay } from '../../../redux/reducers/audioReducer';
import { setPageNumber } from '../../../redux/actions/pageActions';



const IsPlaying = () => {
  return store.getState().audio.isPlaying;
}

const toggleIsPlaying = () => {
  store.dispatch(togglePlay());
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
let position;


// true if we are playing to the end of the mushaf
let isPlayingAllVerses = false;

// true if we are playing a range of verses (from/to)
let isPlayingSomeVerses = false;
let endVerseKey = null;

let nextVerseKey = null;
let currentPageNumber=null;

// when true we go to the next page
let reachedEndOfPage = false;



// playing audio for multiple verses (two or more)
export const playAudioForMultipleVerses = (reciterName, pageNumber, startVerseKey, toVerseKey=null) => {

  // playing a range of verses
  if(toVerseKey !== null){
    isPlayingSomeVerses = true;
    endVerseKey = toVerseKey;
  }
  // playing all the verses
  else {
    isPlayingAllVerses = true;
  }

    currentPageNumber = pageNumber;

    // playing one verse at a time squentially until we finish the verses
    playAudioForOneVerse(reciterName, currentPageNumber, startVerseKey);
}

// playing audio for one verse
export const playAudioForOneVerse = async(reciterName, pageNumber, verseKey) => {

  if(currentPageNumber === null)
    currentPageNumber = pageNumber;

  const isPlaying = IsPlaying();

  if (isPlaying === false){

    toggleIsPlaying(); // isPlaying = ture

    // get the URL then load the verse audio from the API
    const verseAudioUrl = await getVerseAudioURL(reciterName, verseKey);
    verseAudio = await loadVerseAudio(verseAudioUrl);

    // play the audio
    await verseAudio.playAsync();

    verseAudio.setOnPlaybackStatusUpdate((status) => {

      // when the audio is done
      if(status.didJustFinish) {

        toggleIsPlaying(); // isPlaying = false

        // continue to play the rest of the verses until the end of the mushaf
        if(isPlayingAllVerses){
          if(nextVerseKey === '114:6')
            isPlayingAllVerses = false;
          return playAudioForOneVerse(reciterName, currentPageNumber, nextVerseKey);
        }

        // continue to play the rest of the verses if we didn't reach the end verse
        else if (isPlayingSomeVerses){
          if(nextVerseKey === endVerseKey)
            isPlayingSomeVerses = false;
          return playAudioForOneVerse(reciterName, currentPageNumber, nextVerseKey);
        }

        // if it was just one verse audio or all the verses ended
        else {
          resetResources();
        }
      }
    });
  }
}

// Pause the verse audio at a certain position
export const pauseAudio = async() => {
  const isPlaying = IsPlaying();
  if (isPlaying === true) {
    toggleIsPlaying();
    position = verseAudio.getStatusAsync().positionMillis;
    verseAudio.pauseAsync();
  }
}

// Resume the verse audio from the paused at position
export const resumeAudio = async() => {
  const isPlaying = IsPlaying();
  if (isPlaying === false) {
    toggleIsPlaying();
    verseAudio.playFromPositionAsync(position);
  }
}

// Stop the verse audio
export const stopAudio = async() => {
  const isPlaying = IsPlaying();
  if (isPlaying === true) {
    toggleIsPlaying();
    verseAudio.stopAsync();
    resetResources();
  }
}

// reset and clear the unused resources
const resetResources = () => {
  verseAudio.unloadAsync();
  isPlayingAllVerses = false;
  isPlayingSomeVerses = false;
}



// get the verse audio url from the API response
const getVerseAudioURL = async(reciterName, verseKey) => {

  // if we reached the end of the page you need to go to next page and load the new audio urls
  if(reachedEndOfPage === true){
    const verseAudioUrl = await getFirstVerseAudioURLInNextPage(reciterName, currentPageNumber);
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
const getFirstVerseAudioURLInNextPage = (reciterName) => {
  // the last page we can go to is 604
  if(currentPageNumber < 604){
    // go to the next page
    currentPageNumber++;
    changePageNumber(currentPageNumber);
    reachedEndOfPage = false;
    
    return new Promise((resolve) => {
      // wait until the new audio urls have loaded from the API
      const intervalId = setInterval(()=> {
        // when the loading is done
        if(IsLoading() === false) {
          clearInterval(intervalId);
          // get the all the audio urls for the current page
          const versesAudioUrls = store.getState().page.versesAudio;
          const versesAudioUrlsPerPage = versesAudioUrls[`${currentPageNumber}`];

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