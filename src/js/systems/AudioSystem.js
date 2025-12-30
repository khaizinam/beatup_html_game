export default class AudioSystem {
    constructor() {
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

        Object.values(this.sounds).forEach(s => s.volume = 0.4);
        if (this.sounds.perfect) this.sounds.perfect.volume = 0.6;
    }

    playMusic(path) {
        if (this.music) { this.music.pause(); }
        this.music = new Audio(path);
        this.music.volume = 0.5;
        this.music.play().catch(e => console.warn("Music load failed or autoplay blocked", e));
    }

    playBGM() {
        if (!this.bgm) {
            this.bgm = new Audio('public/audio/background-loop.mp3');
            this.bgm.loop = true;
            this.bgm.volume = 0.3;
        }
        if (this.bgm.paused) {
            this.bgm.play().catch(e => console.log("BGM Auto-play blocked"));
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
    }

    toggleMusic(play) {
        if (!this.music) return;
        if (play) this.music.play();
        else this.music.pause();
    }

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    playKey() { this.play(this.sounds.key); }
    playStart() { this.play(this.sounds.start); }
    playJudgement(type) {
        const key = type.toLowerCase();
        if (this.sounds[key]) this.play(this.sounds[key]);
    }
    play(audioObj) {
        if (audioObj) {
            const clone = audioObj.cloneNode();
            clone.volume = audioObj.volume;
            clone.play().catch(e => { });
        }
    }
}
