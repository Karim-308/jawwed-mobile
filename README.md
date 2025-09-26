# 🕌 AI Assisted Holy Quran App

> An AI-powered mobile & web application designed to enhance reading, learning, and memorization of the Holy Quran with interactive feedback, recitation assessment, and spiritual tools.

---

## 📱 Features

### 🔸 Core Quran Features
- 📖 **Complete Digital Quran** – Uthmanic script (UthmanicHafs font) with authentic Mushaf layout (604 pages)
- 📑 **Page-by-Page Navigation** – Swipe gestures for Mushaf-style reading
- ✨ **Verse Selection** – Long-press ayahs with highlighting
- 🔊 **Audio Recitation** – Multiple reciters, word-by-word highlighting
- ⏯ **Playback Controls** – Single verse, continuous, pause/resume
- 🔍 **Text Search** – Advanced keyword search with highlights
- 🔖 **Bookmarking System** – Save verses with notes & categories
- 📤 **Sharing** – Export verses as text or images

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
- 📿 **Azkar (Dhikr)** – Morning/evening azkar + digital tasbih counter
- 📈 **Khatma Planning** – Reading goals & progress visualization
- 📆 **Daily Reading Targets** – Custom schedules & reminders

### 🔸 Educational Features
- ❓ **Interactive Quiz System** – Adaptive difficulty & analytics
- 📚 **Tafsir Integration** – Verse-by-verse explanations, multilingual
- 🎓 **Study Mode** – Distraction-free reading interface

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

## 📂 Project Structure

```bash
src/
├── 📁 api/            # Service layer (auth, azkar, bookmark, khatma, quiz, tafsir)
├── 📁 assets/         # Fonts, images, audio, data (quran-text.json, translations.json)
├── 📁 components/     # Reusable UI components (quran, prayer, forms, etc.)
├── 📁 constants/      # Colors, fonts, API configs, islamic constants
├── 📁 lib/            # External libs (adhan, audio processing, utils)
├── 📁 navigation/     # App, Auth, Tab, Drawer navigators
├── 📁 redux/          # Actions, reducers, middleware, store
├── 📁 screens/        # Feature-based screens (moshaf, prayer-times, tasmee, quiz, etc.)
├── 📁 styles/         # Global themes, typography, animations
└── 📁 utils/          # Helpers (arabicTextProcessor, audioUtils, networkUtils, etc.)
