import { Audio } from 'expo-av';


let verseAudio;
// Playing and stopping the audio
export const toggleAudio = async (isPlaying, verseKeys, reciter) => {

  if (isPlaying === false){
    verseAudio = await loadVerseAudio(getVerseAudioURL(verseKeys, reciter));
    await verseAudio.playAsync();
  }
  else {
    verseAudio.stopAsync();
  }
}

// Getting the API URL
getVerseAudioURL = (verseKeys, reciter) => {
  const verseKeysArray = verseKeys.split(':');
  const urlKey= verseKeysArray[0].padStart(3, '0') + verseKeysArray[1].padStart(3, '0');
  return `https://verses.quran.com/${reciter}/mp3/${urlKey}.mp3`;
}

// Loading the verse audio
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