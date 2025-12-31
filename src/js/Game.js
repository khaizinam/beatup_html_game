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
        this.audioSystem.playBGM(); // Play on load

        // Loop
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    // -- MENU LOGIC --
    initMenu() {
        // Populate Songs
        const songListContainer = document.getElementById('setting-song-list');
        const songInput = document.getElementById('setting-song');
        songListContainer.innerHTML = '';

        SONG_LIST.forEach((s, index) => {
            const item = document.createElement('div');
            item.className = 'song-item' + (index === 0 ? ' active' : '');
            item.dataset.id = s.id;

            const minutes = Math.floor(s.duration / 60);
            const seconds = s.duration % 60;
            const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            item.innerHTML = `
                <span class="song-name">${s.name}</span>
                <span class="song-duration">${timeStr}</span>
            `;

            item.onclick = () => {
                document.querySelectorAll('.song-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                songInput.value = s.id;
            };

            songListContainer.appendChild(item);
            if (index === 0) songInput.value = s.id;
        });

        // Mode and Difficulty Selection
        const setupSelectionGroup = (groupId, inputId) => {
            const group = document.getElementById(groupId);
            const input = document.getElementById(inputId);
            const buttons = group.querySelectorAll('.selection-btn');

            buttons.forEach(btn => {
                btn.onclick = () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    input.value = btn.dataset.value;
                };
            });
        };

        setupSelectionGroup('setting-mode-group', 'setting-mode');
        setupSelectionGroup('setting-diff-group', 'setting-diff');

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

        // Apply Speed Multiplier from Difficulty (Visual Only)
        const diffConfig = DIFFICULTY_CONFIG[this.config.diff];
        const speedMult = diffConfig.speedMultiplier || 1.0;

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
        setTimeout(() => {
            if (this.state === 'STARTING') { // Check in case they quit during start
                this.audioSystem.playMusic(this.songData.file);
                this.state = 'PLAYING';
                this.elapsedTime = 0; // Ensure 0 start
            }
        }, 2000);
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
        this.audioSystem.playBGM();
        this.showScreen('screen-menu');
        document.getElementById('modal-pause').classList.add('hidden');
    }

    endGame() {
        this.state = 'GAMEOVER';
        this.audioSystem.stopMusic();
        this.audioSystem.playBGM();
        this.showScreen('screen-result');

        // Fill Result
        document.getElementById('res-song').innerText = this.songData.name;
        document.getElementById('res-score').innerText = this.score;
        document.getElementById('res-combo').innerText = this.maxCombo;

        // Rank Logic
        let rank = 'F';
        if (this.score > 5000) rank = 'S';
        else if (this.score > 3000) rank = 'A';
        else if (this.score > 1000) rank = 'B';
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

    update(dt) {
        // Check End
        if (this.elapsedTime >= this.songData.duration) {
            this.endGame();
            return;
        }

        // Check Phase/Segment
        const seg = this.songData.segments.find(s => this.elapsedTime >= s.start && this.elapsedTime < s.end);
        if (seg) {
            const diffConfig = DIFFICULTY_CONFIG[this.config.diff];
            const speedMult = diffConfig.speedMultiplier || 1.0;
            const targetBpm = seg.bpm * speedMult;

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
            if (text === 'PERFECT') pts = 100;
            if (text === 'GREAT') pts = 50;
            if (text === 'COOL') pts = 10;

            // Difficulty Score Multiplier
            // EASY: 0.8x, NORMAL: 1.0x, HARD: 1.2x, EXPERT: 1.5x
            let diffMult = 1.0;
            if (this.config.diff === 'EASY') diffMult = 0.8;
            else if (this.config.diff === 'NORMAL') diffMult = 1.0;
            else if (this.config.diff === 'HARD') diffMult = 1.2;
            else if (this.config.diff === 'EXPERT') diffMult = 1.5;

            this.score += Math.floor(pts * (1 + Math.floor(this.combo / 10)) * diffMult);
        }
        this.uiSystem.updateUI();
    }
}
