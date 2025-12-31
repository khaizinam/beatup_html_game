/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/Game.js"
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BeatUpGame)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/js/constants.js");
/* harmony import */ var _config_data_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/data.js */ "./src/js/config/data.js");
/* harmony import */ var _systems_AudioSystem_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./systems/AudioSystem.js */ "./src/js/systems/AudioSystem.js");
/* harmony import */ var _systems_BeatSystem_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./systems/BeatSystem.js */ "./src/js/systems/BeatSystem.js");
/* harmony import */ var _systems_NoteSystem_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./systems/NoteSystem.js */ "./src/js/systems/NoteSystem.js");
/* harmony import */ var _systems_InputSystem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./systems/InputSystem.js */ "./src/js/systems/InputSystem.js");
/* harmony import */ var _systems_UISystem_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./systems/UISystem.js */ "./src/js/systems/UISystem.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







var BeatUpGame = /*#__PURE__*/function () {
  function BeatUpGame() {
    var _this = this;
    _classCallCheck(this, BeatUpGame);
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // State
    this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
    this.lastTime = 0;

    // Config
    this.config = {
      mode: '4K',
      diff: 'NORMAL',
      songId: null,
      autoPlay: false
    };

    // Runtime Data
    this.songData = null;
    this.elapsedTime = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.level = 1;
    this.bpm = 100;
    this.currentPhaseIdx = 0;

    // Systems
    this.audioSystem = new _systems_AudioSystem_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.beatSystem = new _systems_BeatSystem_js__WEBPACK_IMPORTED_MODULE_3__["default"](this);
    this.noteSystem = new _systems_NoteSystem_js__WEBPACK_IMPORTED_MODULE_4__["default"](this);
    this.inputSystem = new _systems_InputSystem_js__WEBPACK_IMPORTED_MODULE_5__["default"](this);
    this.uiSystem = new _systems_UISystem_js__WEBPACK_IMPORTED_MODULE_6__["default"](this);

    // Device Check
    this.checkDevice();
    window.addEventListener('resize', function () {
      return _this.checkDevice();
    });

    // Init
    this.initMenu();
    this.audioSystem.playBGM(); // Play on load

    // Loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  // -- MENU LOGIC --
  return _createClass(BeatUpGame, [{
    key: "initMenu",
    value: function initMenu() {
      var _this2 = this;
      // Populate Songs
      var songListContainer = document.getElementById('setting-song-list');
      var songInput = document.getElementById('setting-song');
      songListContainer.innerHTML = '';
      _config_data_js__WEBPACK_IMPORTED_MODULE_1__.SONG_LIST.forEach(function (s, index) {
        var item = document.createElement('div');
        item.className = 'song-item' + (index === 0 ? ' active' : '');
        item.dataset.id = s.id;
        var minutes = Math.floor(s.duration / 60);
        var seconds = s.duration % 60;
        var timeStr = "".concat(minutes, ":").concat(seconds.toString().padStart(2, '0'));
        item.innerHTML = "\n                <span class=\"song-name\">".concat(s.name, "</span>\n                <span class=\"song-duration\">").concat(timeStr, "</span>\n            ");
        item.onclick = function () {
          document.querySelectorAll('.song-item').forEach(function (el) {
            return el.classList.remove('active');
          });
          item.classList.add('active');
          songInput.value = s.id;
        };
        songListContainer.appendChild(item);
        if (index === 0) songInput.value = s.id;
      });

      // Mode and Difficulty Selection
      var setupSelectionGroup = function setupSelectionGroup(groupId, inputId) {
        var group = document.getElementById(groupId);
        var input = document.getElementById(inputId);
        var buttons = group.querySelectorAll('.selection-btn');
        buttons.forEach(function (btn) {
          btn.onclick = function () {
            buttons.forEach(function (b) {
              return b.classList.remove('active');
            });
            btn.classList.add('active');
            input.value = btn.dataset.value;
          };
        });
      };
      setupSelectionGroup('setting-mode-group', 'setting-mode');
      setupSelectionGroup('setting-diff-group', 'setting-diff');

      // Event Listeners
      document.getElementById('btn-start').onclick = function () {
        return _this2.startGame();
      };
      document.getElementById('btn-resume').onclick = function () {
        return _this2.resumeGame();
      };
      document.getElementById('btn-menu').onclick = function () {
        return _this2.quitToMenu();
      };
      document.getElementById('btn-home').onclick = function () {
        return _this2.showScreen('screen-menu');
      };
      document.getElementById('btn-replay').onclick = function () {
        return _this2.startGame();
      }; // Re-use settings

      this.showScreen('screen-menu');
    }
  }, {
    key: "startGame",
    value: function startGame() {
      var _this3 = this;
      // Read Settings
      this.config.mode = document.getElementById('setting-mode').value;
      this.config.diff = document.getElementById('setting-diff').value;
      this.config.songId = document.getElementById('setting-song').value;
      this.config.autoPlay = document.getElementById('setting-auto').checked;

      // Load Data
      this.songData = _config_data_js__WEBPACK_IMPORTED_MODULE_1__.SONG_LIST.find(function (s) {
        return s.id === _this3.config.songId;
      });
      if (!this.songData) return alert("Song not found!");

      // Reset Game Data
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.level = 1;
      this.elapsedTime = 0;
      this.currentPhaseIdx = 0;
      this.bpm = this.songData.segments[0].bpm;

      // Apply Speed Multiplier from Difficulty (Visual Only)
      var diffConfig = _constants_js__WEBPACK_IMPORTED_MODULE_0__.DIFFICULTY_CONFIG[this.config.diff];
      var speedMult = diffConfig.speedMultiplier || 1.0;

      // Store base BPM (from song data) - this tracks the SONG's BPM
      this.bpm = this.songData.segments[0].bpm;

      // Update BeatSystem with SCALED BPM for visual speed
      // Higher speedMult = faster visual bar, but music plays at normal 1.0x
      this.beatSystem.updateSpeed(this.bpm * speedMult);
      this.noteSystem.reset();
      this.audioSystem.stopBGM();

      // Reset UI elements
      this.uiSystem.updateUI(); // Update score/combo/level displays
      document.getElementById('judgement').innerText = 'Ready?'; // Clear old judgement text
      document.getElementById('judgement').style.color = '#fff';

      // Start Sequence
      this.state = 'STARTING';
      this.audioSystem.playStart();
      this.showScreen('screen-game');

      // Draw "Ready" or similar immediately? The loop will handle it.
      setTimeout(function () {
        if (_this3.state === 'STARTING') {
          // Check in case they quit during start
          _this3.audioSystem.playMusic(_this3.songData.file);
          _this3.state = 'PLAYING';
          _this3.elapsedTime = 0; // Ensure 0 start
        }
      }, 2000);
    }
  }, {
    key: "togglePause",
    value: function togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.audioSystem.toggleMusic(false);
        document.getElementById('modal-pause').classList.remove('hidden');
      } else if (this.state === 'PAUSED') {
        this.resumeGame();
      }
    }
  }, {
    key: "resumeGame",
    value: function resumeGame() {
      this.state = 'PLAYING';
      this.audioSystem.toggleMusic(true);
      document.getElementById('modal-pause').classList.add('hidden');
    }
  }, {
    key: "quitToMenu",
    value: function quitToMenu() {
      this.state = 'MENU';
      this.audioSystem.stopMusic();
      this.audioSystem.playBGM();
      this.showScreen('screen-menu');
      document.getElementById('modal-pause').classList.add('hidden');
    }
  }, {
    key: "endGame",
    value: function endGame() {
      this.state = 'GAMEOVER';
      this.audioSystem.stopMusic();
      this.audioSystem.playBGM();
      this.showScreen('screen-result');

      // Fill Result
      document.getElementById('res-song').innerText = this.songData.name;
      document.getElementById('res-score').innerText = this.score;
      document.getElementById('res-combo').innerText = this.maxCombo;

      // Rank Logic
      var rank = 'F';
      if (this.score > 5000) rank = 'S';else if (this.score > 3000) rank = 'A';else if (this.score > 1000) rank = 'B';
      document.getElementById('res-rank').innerText = rank;
    }
  }, {
    key: "showScreen",
    value: function showScreen(id) {
      document.querySelectorAll('.screen').forEach(function (el) {
        return el.classList.remove('active');
      });
      document.getElementById(id).classList.add('active');
    }

    // -- LOOP --
  }, {
    key: "loop",
    value: function loop(timestamp) {
      var dt = timestamp - this.lastTime;
      this.lastTime = timestamp;
      if (this.state === 'PLAYING') {
        // Sync with Audio Time if available
        var audioTime = this.audioSystem.music ? this.audioSystem.music.currentTime : this.elapsedTime;
        // Smooth sync or hard sync? For simple logic, use raw audio time
        if (Math.abs(audioTime - this.elapsedTime) > 0.1) {
          this.elapsedTime = audioTime;
        } else {
          this.elapsedTime += dt / 1000; // Normal time - music plays at 1.0x
        }
        this.update(dt);
        this.draw();
      } else if (this.state === 'PAUSED') {
        this.draw(); // Keep drawing last frame
      } else if (this.state === 'STARTING') {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        // Draw Ready Text
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 40px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("READY...", 400, 300);
      }
      requestAnimationFrame(this.loop);
    }
  }, {
    key: "update",
    value: function update(dt) {
      var _this4 = this;
      // Check End
      if (this.elapsedTime >= this.songData.duration) {
        this.endGame();
        return;
      }

      // Check Phase/Segment
      var seg = this.songData.segments.find(function (s) {
        return _this4.elapsedTime >= s.start && _this4.elapsedTime < s.end;
      });
      if (seg) {
        var diffConfig = _constants_js__WEBPACK_IMPORTED_MODULE_0__.DIFFICULTY_CONFIG[this.config.diff];
        var speedMult = diffConfig.speedMultiplier || 1.0;
        var targetBpm = seg.bpm * speedMult;
        if (targetBpm !== this.bpm) {
          this.bpm = targetBpm;
          this.level = seg.mode;
          this.beatSystem.updateSpeed(this.bpm);
          this.triggerJudgement(seg.label, "#FFD700");
        }
      }
      if (this.config.autoPlay) {
        this.noteSystem.updateAutoPlay();
      }
      this.beatSystem.update(dt);
    }
  }, {
    key: "draw",
    value: function draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBackground();
      this.beatSystem.draw(this.ctx);
      this.noteSystem.draw(this.ctx);
      this.uiSystem.draw(this.ctx);
    }
  }, {
    key: "drawBackground",
    value: function drawBackground() {
      this.ctx.fillStyle = '#111';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.strokeStyle = '#222';
      this.ctx.lineWidth = 1;
      for (var x = 0; x < 800; x += 40) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, 600);
        this.ctx.stroke();
      }
      for (var y = 0; y < 600; y += 40) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(800, y);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }, {
    key: "triggerJudgement",
    value: function triggerJudgement(text, color) {
      var el = document.getElementById('judgement');
      el.innerText = text;
      el.style.color = color;
      el.style.transform = 'translateX(-50%) scale(1.5)';
      setTimeout(function () {
        return el.style.transform = 'translateX(-50%) scale(1)';
      }, 100);
      if (['PERFECT', 'GREAT', 'COOL', 'BAD', 'MISS'].includes(text)) {
        this.audioSystem.playJudgement(text);
      }
      if (text === 'MISS' || text === 'BAD' || text === 'RESET') {
        this.combo = 0;
      } else if (['PERFECT', 'GREAT', 'COOL'].includes(text)) {
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        var pts = 0;
        if (text === 'PERFECT') pts = 100;
        if (text === 'GREAT') pts = 50;
        if (text === 'COOL') pts = 10;

        // Difficulty Score Multiplier
        // EASY: 0.8x, NORMAL: 1.0x, HARD: 1.2x, EXPERT: 1.5x
        var diffMult = 1.0;
        if (this.config.diff === 'EASY') diffMult = 0.8;else if (this.config.diff === 'NORMAL') diffMult = 1.0;else if (this.config.diff === 'HARD') diffMult = 1.2;else if (this.config.diff === 'EXPERT') diffMult = 1.5;
        this.score += Math.floor(pts * (1 + Math.floor(this.combo / 10)) * diffMult);
      }
      this.uiSystem.updateUI();
    }
  }, {
    key: "checkDevice",
    value: function checkDevice() {
      var warningModal = document.getElementById('modal-device-warning');
      if (window.innerWidth < 850) {
        warningModal.classList.remove('hidden');
        // If in game, pause or force menu
        if (this.state === 'PLAYING') {
          this.togglePause();
        }
      } else {
        warningModal.classList.add('hidden');
      }
    }
  }]);
}();


/***/ },

/***/ "./src/js/config/data.js"
/*!*******************************!*\
  !*** ./src/js/config/data.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SONG_LIST: () => (/* binding */ SONG_LIST)
/* harmony export */ });
var SONG_LIST = [{
  id: 'sorry_bao_thi',
  name: 'Sorry - Bảo Thy',
  file: 'public/music/sorry_bao_thi.mp3',
  duration: 240,
  // 4:00
  segments: [{
    start: 0,
    end: 30,
    mode: 1,
    bpm: 100,
    label: "Warm Up"
  }, {
    start: 30,
    end: 120,
    mode: 2,
    bpm: 130,
    label: "Normal"
  }, {
    start: 120,
    end: 180,
    mode: 3,
    bpm: 160,
    label: "Fast"
  }, {
    start: 180,
    end: 240,
    mode: 4,
    bpm: 190,
    label: "Super Fast"
  }]
}, {
  id: 'khoc_dong_nhi',
  name: 'Khóc - Đông Nhi',
  file: 'public/music/Khoc-Dong-Nhi.mp3',
  duration: 240,
  // Estimated
  segments: [{
    start: 0,
    end: 30,
    mode: 1,
    bpm: 100,
    label: "Warm Up"
  }, {
    start: 30,
    end: 120,
    mode: 2,
    bpm: 130,
    label: "Normal"
  }, {
    start: 120,
    end: 180,
    mode: 3,
    bpm: 160,
    label: "Fast"
  }, {
    start: 180,
    end: 240,
    mode: 4,
    bpm: 190,
    label: "Super Fast"
  }]
}, {
  id: 'ten_minutes',
  name: '10 Minutes - Lee Hyori',
  file: 'public/music/10_minutes.mp3',
  duration: 160,
  // 2:40
  segments: [{
    start: 0,
    end: 30,
    mode: 1,
    bpm: 100,
    label: "Warm Up"
  }, {
    start: 30,
    end: 80,
    mode: 2,
    bpm: 130,
    label: "Normal"
  }, {
    start: 80,
    end: 120,
    mode: 3,
    bpm: 160,
    label: "Fast"
  }, {
    start: 120,
    end: 160,
    mode: 4,
    bpm: 190,
    label: "Super Fast"
  }]
}, {
  id: 'killing_me',
  name: 'Killing Me - iKON',
  file: 'public/music/killing_me.mp3',
  duration: 193,
  // 3:13
  segments: [{
    start: 0,
    end: 33,
    mode: 1,
    bpm: 110,
    label: "Intro"
  }, {
    start: 33,
    end: 90,
    mode: 2,
    bpm: 125,
    label: "Verse"
  }, {
    start: 90,
    end: 150,
    mode: 3,
    bpm: 140,
    label: "Chorus"
  }, {
    start: 150,
    end: 193,
    mode: 4,
    bpm: 160,
    label: "Finale"
  }]
}];

/***/ },

/***/ "./src/js/constants.js"
/*!*****************************!*\
  !*** ./src/js/constants.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DIFFICULTY_CONFIG: () => (/* binding */ DIFFICULTY_CONFIG),
/* harmony export */   KEYS: () => (/* binding */ KEYS),
/* harmony export */   MODE_MAP: () => (/* binding */ MODE_MAP),
/* harmony export */   PHASES: () => (/* binding */ PHASES)
/* harmony export */ });
var KEYS = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  SPACE: 'Space',
  ESC: 'Escape'
};
var MODE_MAP = {
  '4K': ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'],
  '8K': ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'KeyA', 'KeyS', 'KeyD', 'KeyF']
};
var PHASES = [{
  time: 0,
  bpm: 100,
  label: "PHASE 1: WARM UP"
}, {
  time: 75,
  bpm: 130,
  label: "PHASE 2: HEATING UP"
},
// 1:15
{
  time: 150,
  bpm: 160,
  label: "PHASE 3: HIGH SPEED"
},
// 2:30
{
  time: 225,
  bpm: 190,
  label: "PHASE 4: BEAT UP MODE"
},
// 3:45
{
  time: 300,
  bpm: 0,
  label: "FINISH"
} // 5:00
];
var DIFFICULTY_CONFIG = {
  'EASY': {
    noteCountBonus: -1,
    speedMultiplier: 0.6
  },
  'NORMAL': {
    noteCountBonus: 0,
    speedMultiplier: 1.0
  },
  'HARD': {
    noteCountBonus: 1,
    speedMultiplier: 1.2
  },
  'EXPERT': {
    noteCountBonus: 2,
    speedMultiplier: 1.5
  }
};

/***/ },

/***/ "./src/js/systems/AudioSystem.js"
/*!***************************************!*\
  !*** ./src/js/systems/AudioSystem.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioSystem)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AudioSystem = /*#__PURE__*/function () {
  function AudioSystem() {
    _classCallCheck(this, AudioSystem);
    this.sounds = {
      key: new Audio('public/audio/key.wav'),
      space: new Audio('public/audio/space.wav'),
      perfect: new Audio('public/audio/perfect.wav'),
      great: new Audio('public/audio/great.wav'),
      bad: new Audio('public/audio/bad.wav'),
      miss: new Audio('public/audio/miss.wav'),
      start: new Audio('public/audio/game-start.mp3')
    };
    this.music = null;
    Object.values(this.sounds).forEach(function (s) {
      return s.volume = 0.4;
    });
    if (this.sounds.perfect) this.sounds.perfect.volume = 0.6;
  }
  return _createClass(AudioSystem, [{
    key: "playMusic",
    value: function playMusic(path) {
      if (this.music) {
        this.music.pause();
      }
      this.music = new Audio(path);
      this.music.volume = 0.5;
      this.music.play()["catch"](function (e) {
        return console.warn("Music load failed or autoplay blocked", e);
      });
    }
  }, {
    key: "playBGM",
    value: function playBGM() {
      if (!this.bgm) {
        this.bgm = new Audio('public/audio/background-loop.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0.3;
      }
      if (this.bgm.paused) {
        this.bgm.play()["catch"](function (e) {
          return console.log("BGM Auto-play blocked");
        });
      }
    }
  }, {
    key: "stopBGM",
    value: function stopBGM() {
      if (this.bgm) {
        this.bgm.pause();
        this.bgm.currentTime = 0;
      }
    }
  }, {
    key: "toggleMusic",
    value: function toggleMusic(play) {
      if (!this.music) return;
      if (play) this.music.play();else this.music.pause();
    }
  }, {
    key: "stopMusic",
    value: function stopMusic() {
      if (this.music) {
        this.music.pause();
        this.music.currentTime = 0;
      }
    }
  }, {
    key: "playKey",
    value: function playKey() {
      this.play(this.sounds.key);
    }
  }, {
    key: "playStart",
    value: function playStart() {
      this.play(this.sounds.start);
    }
  }, {
    key: "playJudgement",
    value: function playJudgement(type) {
      var key = type.toLowerCase();
      if (this.sounds[key]) this.play(this.sounds[key]);
    }
  }, {
    key: "play",
    value: function play(audioObj) {
      if (audioObj) {
        var clone = audioObj.cloneNode();
        clone.volume = audioObj.volume;
        clone.play()["catch"](function (e) {});
      }
    }
  }]);
}();


/***/ },

/***/ "./src/js/systems/BeatSystem.js"
/*!**************************************!*\
  !*** ./src/js/systems/BeatSystem.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BeatSystem)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var BeatSystem = /*#__PURE__*/function () {
  function BeatSystem(game) {
    _classCallCheck(this, BeatSystem);
    this.game = game;
    this.measureProgress = 0;
    this.bpm = 100;
    this.measureDuration = 2400;
    this.barX = 100;
    this.barY = 500;
    this.barW = 600;
    this.targetPercent = 0.85;
    this.zoneWidth = 0.10;
  }
  return _createClass(BeatSystem, [{
    key: "updateSpeed",
    value: function updateSpeed(bpm) {
      this.bpm = bpm;
      this.measureDuration = 60 * 1000 / this.bpm * 4;
    }
  }, {
    key: "update",
    value: function update(dt) {
      this.measureProgress += dt / this.measureDuration;
      if (this.measureProgress >= 1.0) {
        if (this.game.noteSystem.hasPendingNotes()) {
          this.game.triggerJudgement("MISS", "red");
          this.game.noteSystem.reset();
        }
        this.measureProgress = 0;
        this.game.noteSystem.generateSequence();
      }

      // Auto Play Logic: Auto Space
      if (this.game.config.autoPlay && this.game.noteSystem.isComplete()) {
        var diff = Math.abs(this.measureProgress - this.targetPercent);
        if (diff < 0.005) {
          // Super precise
          this.game.triggerJudgement("PERFECT", "#0ff");
          this.game.noteSystem.reset();
          this.game.audioSystem.play('space');
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = '#333';
      ctx.fillRect(this.barX, this.barY, this.barW, 10);
      var zoneStart = this.barX + (this.targetPercent - this.zoneWidth / 2) * this.barW;
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.fillRect(zoneStart, this.barY - 5, this.zoneWidth * this.barW, 20);
      var perfectX = this.barX + this.targetPercent * this.barW;
      ctx.fillStyle = '#fff';
      ctx.fillRect(perfectX - 1, this.barY - 10, 2, 30);
      var ballX = this.barX + this.measureProgress * this.barW;
      ctx.beginPath();
      ctx.arc(ballX, this.barY + 5, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#0ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ff';
      ctx.fill();
      ctx.shadowBlur = 0;
      if (Math.abs(this.measureProgress - this.targetPercent) < this.zoneWidth / 2) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, {
    key: "checkTiming",
    value: function checkTiming() {
      var diff = Math.abs(this.measureProgress - this.targetPercent);
      if (diff < 0.01) return 'PERFECT';
      if (diff < 0.03) return 'GREAT';
      if (diff < 0.06) return 'COOL';
      if (diff < 0.10) return 'BAD';
      return 'MISS';
    }
  }]);
}();


/***/ },

/***/ "./src/js/systems/InputSystem.js"
/*!***************************************!*\
  !*** ./src/js/systems/InputSystem.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InputSystem)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var InputSystem = /*#__PURE__*/function () {
  function InputSystem(game) {
    var _this = this;
    _classCallCheck(this, InputSystem);
    this.game = game;
    document.addEventListener('keydown', function (e) {
      return _this.onKeyDown(e);
    });
  }
  return _createClass(InputSystem, [{
    key: "onKeyDown",
    value: function onKeyDown(e) {
      if (this.game.state === 'MENU' || this.game.state === 'GAMEOVER') return;
      if (e.code === 'Escape') {
        this.game.togglePause();
        return;
      }
      if (this.game.state !== 'PLAYING') return;
      if (e.code === 'Space') {
        if (this.game.noteSystem.isComplete()) {
          var judgement = this.game.beatSystem.checkTiming();
          var color = "white";
          if (judgement === 'PERFECT') color = "#0ff";
          if (judgement === 'GREAT') color = "#0f0";
          if (judgement === 'COOL') color = "#00f";
          if (judgement === 'BAD') color = "#f00";
          this.game.triggerJudgement(judgement, color);
          this.game.noteSystem.reset();
        } else {
          this.game.triggerJudgement("MISS", "red");
          this.game.noteSystem.reset();
        }
        return;
      }
      this.game.noteSystem.handleInput(e.code);
    }
  }]);
}();


/***/ },

/***/ "./src/js/systems/NoteSystem.js"
/*!**************************************!*\
  !*** ./src/js/systems/NoteSystem.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NoteSystem)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.js */ "./src/js/constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var NoteSystem = /*#__PURE__*/function () {
  function NoteSystem(game) {
    _classCallCheck(this, NoteSystem);
    this.game = game;
    this.sequence = [];
    this.inputIndex = 0;
  }
  return _createClass(NoteSystem, [{
    key: "generateSequence",
    value: function generateSequence() {
      this.sequence = [];
      this.inputIndex = 0;

      // Difficulty Logic
      // Difficulty Logic
      var baseCount = 3;
      var lvl = this.game.level;
      if (lvl === 1) baseCount = 3;else if (lvl === 2) baseCount = 4 + (Math.random() > 0.5 ? 1 : 0);else if (lvl === 3) baseCount = 6;else if (lvl === 4) baseCount = 8;
      var diff = _constants_js__WEBPACK_IMPORTED_MODULE_0__.DIFFICULTY_CONFIG[this.game.config.diff];
      var count = Math.min(8, baseCount + diff.noteCountBonus); // Cap at 8 for consistency

      var pool = _constants_js__WEBPACK_IMPORTED_MODULE_0__.MODE_MAP[this.game.config.mode];
      for (var i = 0; i < count; i++) {
        var k = pool[Math.floor(Math.random() * pool.length)];
        this.sequence.push({
          key: k,
          state: 'PENDING'
        });
      }
      if (this.sequence.length > 0) this.sequence[0].state = 'ACTIVE';
    }
  }, {
    key: "hasPendingNotes",
    value: function hasPendingNotes() {
      return this.sequence.some(function (n) {
        return n.state !== 'DONE';
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.sequence = [];
      this.inputIndex = 0;
    }
  }, {
    key: "handleInput",
    value: function handleInput(code) {
      if (this.sequence.length === 0) return;
      if (this.inputIndex >= this.sequence.length) return; // Guard: Sequence complete
      var currentNote = this.sequence[this.inputIndex];
      if (code === currentNote.key) {
        currentNote.state = 'DONE';
        this.inputIndex++;
        this.game.audioSystem.playKey();
        if (this.inputIndex < this.sequence.length) {
          this.sequence[this.inputIndex].state = 'ACTIVE';
        }
      } else {
        this.inputIndex = 0;
        this.sequence.forEach(function (n) {
          return n.state = 'PENDING';
        });
        if (this.sequence.length > 0) this.sequence[0].state = 'ACTIVE';
        this.game.triggerJudgement("RESET", "orange");
      }
    }
  }, {
    key: "updateAutoPlay",
    value: function updateAutoPlay() {
      if (this.sequence.length > 0 && this.inputIndex < this.sequence.length) {
        var currentNote = this.sequence[this.inputIndex];
        // Randomly hit notes fast
        if (Math.random() > 0.8 || this.inputIndex === 0) {
          this.handleInput(currentNote.key);
        }
      }
    }
  }, {
    key: "isComplete",
    value: function isComplete() {
      return this.sequence.length > 0 && this.inputIndex === this.sequence.length;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var _this = this;
      var startX = 400 - this.sequence.length * 40;
      var y = 300;
      ctx.save();
      // Global text settings that don't change per note
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      this.sequence.forEach(function (note, i) {
        var x = startX + i * 80;
        ctx.save();
        ctx.translate(x, y);
        _this.drawNote(ctx, note);
        ctx.restore();
      });
      ctx.restore();
    }
  }, {
    key: "drawNote",
    value: function drawNote(ctx, note) {
      // Define colors per key
      var colors = {
        'ArrowLeft': {
          bg: '#FF5252',
          border: '#D32F2F',
          shadow: '#FF5252'
        },
        // Red
        'ArrowDown': {
          bg: '#448AFF',
          border: '#1976D2',
          shadow: '#448AFF'
        },
        // Blue
        'ArrowUp': {
          bg: '#FFCA28',
          border: '#F57C00',
          shadow: '#FFCA28'
        },
        // Amber
        'ArrowRight': {
          bg: '#69F0AE',
          border: '#388E3C',
          shadow: '#69F0AE'
        },
        // Green
        'default': {
          bg: '#9E9E9E',
          border: '#616161',
          shadow: '#9E9E9E'
        }
      };
      var style = colors[note.key] || colors['default'];
      var isDone = note.state === 'DONE';
      var isActive = note.state === 'ACTIVE';

      // Styles based on state
      var bgColor = style.bg;
      var borderColor = style.border;
      var shadowColor = style.shadow;
      var shadowBlur = 0;
      var alpha = 1.0;
      if (isDone) {
        // "DONE": Vibrant, bold, glowing
        shadowBlur = 15;
        // Keep original vivid colors
      } else {
        // "PENDING": Transparent/Pale color to look "disabled"
        // We use globalAlpha to fade it out significantly
        alpha = 0.3;
      }

      // Apply Shadow logic
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw Box Background
      ctx.fillStyle = bgColor;

      // Save context for alpha application on background
      ctx.save();
      ctx.globalAlpha = alpha;
      var size = 60;
      var half = size / 2;

      // Fill background
      ctx.fillRect(-half, -half, size, size);
      ctx.restore(); // Restore alpha for stroke/text (we want text to be sharp)

      // Border Logic
      ctx.lineWidth = 3;
      // If it's done, white border check? Or keep colored? 
      // User said "Active" (current) should be highlighted? 
      // Actually user said: "sau khi gõ được ... thì có đổi màu đậm" (After typing, change to bold color)
      // So Done = Bold color.

      if (isActive) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#FFFFFF'; // White border for "Target"
        // Maybe add a slight glow to active target too?
        ctx.save();
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.strokeRect(-half, -half, size, size);
        ctx.restore();
      } else {
        // For pending/done
        ctx.strokeStyle = borderColor;
        // If pending, maybe fade the border too?
        if (!isDone) {
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.strokeRect(-half, -half, size, size);
          ctx.restore();
        } else {
          ctx.strokeRect(-half, -half, size, size);
        }
      }

      // -- Text / Arrow --
      // User: "đẹm nét chữ lên" (bold/clearer text)
      var _char = this.getChar(note.key);
      ctx.font = "900 35px Arial"; // 900 weight (Black), slightly larger
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Text rendering
      ctx.shadowBlur = 0; // Ensure text is crisp

      // Stroke first (Outline) - Make it strong so it is visible on any background
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0,0,0, 0.8)'; // darker outline
      ctx.strokeText(_char, 0, 2);

      // Fill second
      ctx.fillStyle = '#FFFFFF'; // White fill
      ctx.fillText(_char, 0, 2);
    }
  }, {
    key: "getChar",
    value: function getChar(key) {
      if (key === 'ArrowUp') return "↑";
      if (key === 'ArrowDown') return "↓";
      if (key === 'ArrowLeft') return "←";
      if (key === 'ArrowRight') return "→";
      return key.replace('Key', '');
    }
  }]);
}();


/***/ },

/***/ "./src/js/systems/UISystem.js"
/*!************************************!*\
  !*** ./src/js/systems/UISystem.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UISystem)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.js */ "./src/js/constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var UISystem = /*#__PURE__*/function () {
  function UISystem(game) {
    _classCallCheck(this, UISystem);
    this.game = game;
    this.scoreEl = document.getElementById('score');
    this.comboEl = document.getElementById('combo');
    this.levelEl = document.getElementById('level');
  }
  return _createClass(UISystem, [{
    key: "updateUI",
    value: function updateUI() {
      this.scoreEl.innerText = this.game.score;
      this.comboEl.innerText = this.game.combo;
      this.levelEl.innerText = this.game.level;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var _this = this;
      var timeLeft = Math.max(0, this.game.songData.duration - this.game.elapsedTime);
      var mins = Math.floor(timeLeft / 60);
      var secs = Math.floor(timeLeft % 60).toString().padStart(2, '0');
      ctx.font = "20px monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("TIME: ".concat(mins, ":").concat(secs), 400, 30);

      // Draw Phase Label
      var currentSeg = this.game.songData.segments.find(function (s) {
        return _this.game.elapsedTime >= s.start && _this.game.elapsedTime < s.end;
      });
      if (currentSeg) {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "center";
        ctx.fillText(currentSeg.label.toUpperCase(), 400, 55);
      }
    }
  }]);
}();


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ "./src/js/Game.js");

window.onload = function () {
  window.game = new _Game_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
};
})();

/******/ })()
;