# 🕌 AI Assisted Holy Quran App

> An AI-powered mobile application designed to enhance reading, learning, and memorization of the Holy Quran with interactive feedback, recitation assessment, and spiritual tools.

---

## 📱 Features

### 🔸 Core Quran Features
- 📖 **Complete Digital Quran** – Uthmanic script (UthmanicHafs font) with authentic Mushaf layout (604 pages)
- 📑 **Page-by-Page Navigation** – Swipe gestures for Mushaf-style reading
- 📖 **Moshaf Index** – Navigate quickly by **Surah**, **Juz**, or **page**, with integrated search and bookmarks  
- ✨ **Verse Selection** – Long-press ayahs with highlighting to display multipe options to be done for the ayah (Bookmark, Tafsir, Share, Audio Play)
- 📚 **Tafsir** – Access verse explanations by long-pressing an ayah → opens **Tafsir modal** with multiple sources (Ibn Kathir, Al-Muyassar, Al-Tabari)
- 🔊 **Audio Recitation** – Multiple reciters, word-by-word highlighting
- ⏯ **Playback Controls** – Single verse, continuous, pause/resume
- 🔍 **Text Search** – Advanced keyword search with highlights
- 🔖 **Bookmarking System** – Quran verses and Azkar could be bookmarked with their metadata
- 📤 **Sharing** – Export verses as text

### 🔸 AI-Powered Tasmee (Recitation Assessment)
- 🎙 **Real-time Voice Recognition** (WebSocket-based Arabic ASR)
- 🗣 **Pronunciation Analysis** with color feedback:
  - 🟩 Perfect  
  - 🟨 Good (80–95%)  
  - 🟧 Needs improvement (60–79%)  
  - 🟥 Incorrect
- ⚙️ Configurable recognition (server, chunk duration)
- 📊 Progress tracking & accuracy visualization
- 🎧 Optimized 16kHz WAV streaming

### 🔸 Spiritual Tools & Worship Aid
- 🕌 **Prayer Times** (Adhan library, multiple methods, notifications)
- 📿 **Azkar (Dhikr)** – Multiple categories that include multiple Azkar (✔️ Play audio (reciter), ✔️ Count dhikr by tapping with vibration, ✔️ Bookmark items)
- 📈 **Khatma Planning** – Reading goals & progress visualization
- 📆 **Daily Reading Targets** – Custom schedules & reminders
- 🧮 **Sebha (Digital Tasbeeh)** – Animated counting, vibration feedback, swipeable phrases, offline persistence
- 🧭 **Qiblah Compass** – Real-time sensor-driven Qiblah direction with orientation feedback

### 🔸 Educational Features
- ❓ **Interactive Quiz System** – Adaptive difficulty & analytics
- 📚 **Tafsir Integration** – Verse-by-verse explanations, multilingual

### 🔸 User Experience
- 👤 Profile management (Google OAuth, preferences)
- 🌙 Dark/Light themes & accessibility support
- 📴 Offline functionality
- 📱 Responsive design & gesture controls

---

## 🛠 Tech Stack

<details>
<summary>Core Framework</summary>

- **React Native** `0.76.9` – Cross-platform app  
- **Expo** – Development toolkit  
- **Metro** – JavaScript bundler  
</details>

<details>
<summary>State Management</summary>

- Redux, React Redux  
- Redux Toolkit  
- Redux Persist  
</details>

<details>
<summary>Navigation & UI</summary>

- React Navigation (stack, tab, drawer)  
- React Native Gesture Handler & Swipe Gestures  
- Expo Vector Icons  
- React Native Elements  
</details>

<details>
<summary>Audio & Media</summary>

- Expo AV, React Native Audio Record, React Native Sound  
- WebSocket – real-time tasmee recognition  
</details>

<details>
<summary>Data & Storage</summary>

- SQLite, AsyncStorage, React Native FS  
- Firebase Firestore  
</details>

<details>
<summary>Authentication & Services</summary>

- Firebase Auth & Google Sign-In  
- Firebase Cloud Messaging (push notifications)  
- Firebase Analytics  
</details>

<details>
<summary>Islamic & Location Services</summary>

- Adhan – prayer time calculations  
- React Native Geolocation  
- Islamic Calendar + Moment.js  
</details>

<details>
<summary>Development & Testing</summary>

- TypeScript, ESLint, Prettier  
- React Native Debugger, Flipper  
- Jest, React Native Testing Library, Detox  
</details>

<details>
<summary>Fonts</summary>

- UthmanicHafs – Quranic script font  
- Custom Arabic fonts + system fonts  
</details>

---

## 🔗 Team Integration

This application was developed by three collaborating sub-teams:

- 📱 **Mobile Team (React Native)**  
  - Built the Quran reading interface (Moshaf, Index, Tafsir modal, Azkar, Sebha, Qiblah, etc.)  
  - Implemented navigation, UI, offline features, and integrations with APIs  

- 🌐 **Backend Team (.NET + Clean Architecture)**  
  - Provided REST APIs for Quran pages, tafsir, azkar, bookmarks, goals (Khatma), quizzes, authentication, and notifications  
  - Designed structured schemas for Mushaf text, chapters, verses, and azkar  
  - Implemented cloud sync, Google OAuth, and real-time WebSocket endpoints  

- 🤖 **AI Team (Speech Recognition)**  
  - Developed the **Tasmee feature** (recitation assessment)  
  - Fine-tuned **Wav2Vec2** and **Whisper** models for Quranic Arabic speech recognition  
  - Built real-time voice recognition with **FastAPI WebSocket streaming** for immediate feedback  
  - Integrated accuracy scoring (color-coded feedback) into the mobile app


## 🎥 Demo

Watch a quick demo of the app in action here:  
▶️ [YouTube Demo Video](https://www.youtube.com/shorts/Qakl_oXfRgM)

---

## 📖 Documentation

Full technical report with implementation details, AI models, backend APIs, and testing:  
📄 [Read Full Documentation (Google Drive)](https://drive.google.com/file/d/1uZxMyg3W5X5ko3e5mQuCvApMm8rkVDTh/view?usp=sharing)

---
