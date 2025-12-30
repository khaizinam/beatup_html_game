import { PHASES, DIFFICULTY_CONFIG } from './constants.js';
import { SONG_LIST } from './config/data.js';
import AudioSystem from './systems/AudioSystem.js';
import BeatSystem from './systems/BeatSystem.js';
import NoteSystem from './systems/NoteSystem.js';
import InputSystem from './systems/InputSystem.js';
import UISystem from './systems/UISystem.js';

export default class BeatUpGame {
    constructor() {
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
        this.audioSystem = new AudioSystem();
        this.beatSystem = new BeatSystem(this);
        this.noteSystem = new NoteSystem(this);
        this.inputSystem = new InputSystem(this);
        this.uiSystem = new UISystem(this);

        // Init
        this.initMenu();

        // Loop
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    // -- MENU LOGIC --
    initMenu() {
        // Populate Songs
        const songSelect = document.getElementById('setting-song');
        songSelect.innerHTML = '';
        SONG_LIST.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.innerText = s.name;
            songSelect.appendChild(opt);
        });

        // Event Listeners
        document.getElementById('btn-start').onclick = () => this.startGame();
        document.getElementById('btn-resume').onclick = () => this.resumeGame();
        document.getElementById('btn-menu').onclick = () => this.quitToMenu();
        document.getElementById('btn-home').onclick = () => this.showScreen('screen-menu');
        document.getElementById('btn-replay').onclick = () => this.startGame(); // Re-use settings

        this.showScreen('screen-menu');
    }

    startGame() {
        // Read Settings
        this.config.mode = document.getElementById('setting-mode').value;
        this.config.diff = document.getElementById('setting-diff').value;
        this.config.songId = document.getElementById('setting-song').value;
        this.config.autoPlay = document.getElementById('setting-auto').checked;

        // Load Data
        this.songData = SONG_LIST.find(s => s.id === this.config.songId);
        if (!this.songData) return alert("Song not found!");

        // Reset Game Data
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.level = 1;
        this.elapsedTime = 0;
        this.currentPhaseIdx = 0;
        this.bpm = this.songData.segments[0].bpm;

        // Reset Systems
        this.beatSystem.updateSpeed(this.bpm);
        this.noteSystem.reset();
        this.audioSystem.playMusic(this.songData.file);

        // Start
        this.state = 'PLAYING';
        this.showScreen('screen-game');
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.audioSystem.toggleMusic(false);
            document.getElementById('modal-pause').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.resumeGame();
        }
    }

    resumeGame() {
        this.state = 'PLAYING';
        this.audioSystem.toggleMusic(true);
        document.getElementById('modal-pause').classList.add('hidden');
    }

    quitToMenu() {
        this.state = 'MENU';
        this.audioSystem.stopMusic();
        this.showScreen('screen-menu');
        document.getElementById('modal-pause').classList.add('hidden');
    }

    endGame() {
        this.state = 'GAMEOVER';
        this.audioSystem.stopMusic();
        this.showScreen('screen-result');

        // Fill Result
        document.getElementById('res-song').innerText = this.songData.name;
        document.getElementById('res-score').innerText = this.score;
        document.getElementById('res-combo').innerText = this.maxCombo;

        // Rank Logic
        let rank = 'F';
        if (this.score > 50000) rank = 'S';
        else if (this.score > 30000) rank = 'A';
        else if (this.score > 10000) rank = 'B';
        document.getElementById('res-rank').innerText = rank;
    }

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    // -- LOOP --
    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.state === 'PLAYING') {
            // Sync with Audio Time if available
            const audioTime = this.audioSystem.music ? this.audioSystem.music.currentTime : this.elapsedTime;
            // Smooth sync or hard sync? For simple logic, use raw audio time
            if (Math.abs(audioTime - this.elapsedTime) > 0.1) {
                this.elapsedTime = audioTime;
            } else {
                this.elapsedTime += dt / 1000;
            }

            this.update(dt);
            this.draw();
        } else if (this.state === 'PAUSED') {
            this.draw(); // Keep drawing last frame
        }

        requestAnimationFrame(this.loop);
    }

    update(dt) {
        // Check End
        if (this.elapsedTime >= this.songData.duration) {
            this.endGame();
            return;
        }

        // Check Phase/Segment
        const seg = this.songData.segments.find(s => this.elapsedTime >= s.start && this.elapsedTime < s.end);
        if (seg && seg.bpm !== this.bpm) {
            this.bpm = seg.bpm;
            this.beatSystem.updateSpeed(this.bpm);
            this.triggerJudgement(seg.label, "#FFD700");
        }

        if (this.config.autoPlay) {
            this.noteSystem.updateAutoPlay();
        }

        this.beatSystem.update(dt);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.beatSystem.draw(this.ctx);
        this.noteSystem.draw(this.ctx);
        this.uiSystem.draw(this.ctx);
    }

    drawBackground() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) { this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, 600); this.ctx.stroke(); }
        for (let y = 0; y < 600; y += 40) { this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(800, y); this.ctx.stroke(); }
        this.ctx.restore();
    }

    triggerJudgement(text, color) {
        const el = document.getElementById('judgement');
        el.innerText = text;
        el.style.color = color;
        el.style.transform = 'translateX(-50%) scale(1.5)';
        setTimeout(() => el.style.transform = 'translateX(-50%) scale(1)', 100);

        if (['PERFECT', 'GREAT', 'COOL', 'BAD', 'MISS'].includes(text)) {
            this.audioSystem.playJudgement(text);
        }

        if (text === 'MISS' || text === 'BAD' || text === 'RESET') {
            this.combo = 0;
        } else if (['PERFECT', 'GREAT', 'COOL'].includes(text)) {
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            let pts = 0;
            if (text === 'PERFECT') pts = 1000;
            if (text === 'GREAT') pts = 500;
            if (text === 'COOL') pts = 100;

            // Diff Mult
            const mult = DIFFICULTY_CONFIG[this.config.diff].noteCountBonus + 1;
            this.score += pts * (1 + Math.floor(this.combo / 10)) * mult;
        }
        this.uiSystem.updateUI();
    }
}
