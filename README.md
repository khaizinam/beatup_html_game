# 🎮 BeatUp - Audition Style Game

A rhythm-based music game inspired by Audition, built with HTML5 Canvas and JavaScript.

## 🎯 Demo

**Play Now:** [https://beatup.khaizinam.io.vn](https://beatup.khaizinam.io.vn)

## 📖 About

BeatUp is a web-based rhythm game where players must memorize and input arrow sequences in sync with the music. The game features multiple difficulty levels, various songs, and a progressive challenge system.

## ✨ Features

- 🎵 **Multiple Songs**: Choose from different tracks with varying BPM and difficulty
- 🎮 **Game Modes**: 4K and 8K modes for different skill levels
- 🏆 **Difficulty Levels**: Easy, Normal, Hard, and Expert
- 🎨 **Visual Feedback**: Color-coded notes with smooth animations
- 💯 **Scoring System**: Combo multipliers and difficulty-based scoring
- ⌨️ **Responsive Controls**: Smooth keyboard input handling
- 🎨 **Modern UI**: Beautiful gradient backgrounds and glowing effects

## 🎮 How to Play

### Controls
- **Arrow Keys (↑ ↓ ← →)**: Input the displayed sequence
- **SPACE**: Complete the sequence when all arrows are entered
- **ESC**: Pause game / Return to menu

### Gameplay
1. Select your preferred mode (4K/8K), difficulty, and song
2. Memorize the arrow sequence shown on screen
3. Input the arrows in the correct order using arrow keys
4. Press SPACE when the progress bar reaches the target zone
5. Chain combos for higher scores!

### Scoring
- **PERFECT**: Hit exactly in the center zone (100 points)
- **GREAT**: Hit close to the center (50 points)
- **COOL**: Hit in the acceptable zone (10 points)
- **BAD/MISS**: Outside the zone (0 points, combo reset)

### Difficulty Multipliers
- **Easy**: 0.6x speed, 0.8x score
- **Normal**: 1.0x speed, 1.0x score
- **Hard**: 1.2x speed, 1.2x score
- **Expert**: 1.5x speed, 1.5x score

## 🛠️ Technology Stack

- **HTML5 Canvas**: Game rendering
- **Vanilla JavaScript**: Game logic (ES6 modules)
- **CSS3**: Styling and animations
- **Laravel Mix**: Asset compilation
- **Web Audio API**: Sound effects and music playback

## 📁 Project Structure

```
public_html/
├── index.html              # Main HTML file
├── public/
│   ├── css/
│   │   └── style.css      # Game styles
│   ├── js/
│   │   └── app.js         # Compiled JavaScript
│   ├── audio/             # Sound effects
│   ├── music/             # Game music tracks
│   └── image/             # Game images
├── src/
│   └── js/
│       ├── Game.js        # Main game class
│       ├── constants.js   # Game constants
│       ├── config/
│       │   └── data.js    # Song configurations
│       └── systems/
│           ├── AudioSystem.js    # Audio management
│           ├── BeatSystem.js     # Timing system
│           ├── NoteSystem.js     # Note generation
│           ├── InputSystem.js    # Input handling
│           └── UISystem.js       # UI updates
├── package.json
└── webpack.mix.js
```

## 🚀 Installation & Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd public_html
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Development mode (with file watching):
```bash
npm run dev
# or
yarn dev
```

4. Production build:
```bash
npm run build
# or
yarn build
```

5. Open `index.html` in your browser or serve with a local server

## 🎵 Adding New Songs

Edit `src/js/config/data.js` to add new songs:

```javascript
{
    id: 'song_id',
    name: 'Song Name - Artist',
    file: 'public/music/song-file.mp3',
    duration: 240, // in seconds
    segments: [
        { start: 0, end: 30, mode: 1, bpm: 100, label: "Warm Up" },
        { start: 30, end: 120, mode: 2, bpm: 130, label: "Normal" },
        // ... more segments
    ]
}
```

## 🎨 Customization

### Difficulty Settings
Edit `src/js/constants.js` to modify difficulty parameters:
- `speedMultiplier`: Visual speed of the game
- `noteCountBonus`: Additional notes per sequence

### Visual Themes
Modify `public/css/style.css` to change colors, backgrounds, and effects.

## 📝 License

This project is created by **khaizinam** for educational and entertainment purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

- **Author**: khaizinam
- **Demo**: [https://beatup.khaizinam.io.vn](https://beatup.khaizinam.io.vn)

---

Made with ❤️ by khaizinam
