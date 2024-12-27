# Audio Service Documentation
---
---

When you call any of these functions, they automatically handle the change of the `isPlaying` state, so no need to worry about it.

## 1- Play Audio

You can play the verse audio in the following ways.

### 1.1- Play Audio for a Single Verse

```js
playAudioForOneVerse(reciterName, pageNumber, verseKey)

// for example
playAudioForOneVerse('Alafasy', 1, '1:5')
```

### 1.2- Play Audio from a Starting Verse to the end of The Mushaf

```js
playAudioForMultipleVerses = (reciterName, pageNumber, startVerseKey)

// for example
playAudioForOneVerse('Alafasy', 2, '2:4')
```

### 1.3- Play Audio for a range of Verses

```js
playAudioForMultipleVerses = (reciterName, pageNumber, startVerseKey, toVerseKey)

// for example
playAudioForOneVerse('Alafasy', 2, '2:4', '2:50')
```

**Note**: the `pageNumber` is the page of the `startVerseKey`.

---

## 2- Stop Audio

Stops the audio immediately when pressed. If the audio has already ended then there's no need to stop it.

```js
stopAudio()
```

---

## 3- Pause Audio

This pauses the audio at a certain position, so when resumed it can continue from this position. Unlike in `stopAudio()` you will play the audio from the initial start.

```js
pauseAudio()
```

---

## 4- Resume Audio

Resumes the audio if it was paused.

```js
resumeAudio()
```