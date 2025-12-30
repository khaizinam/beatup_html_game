import { PHASES } from '../constants.js';

export default class UISystem {
    constructor(game) {
        this.game = game;
        this.scoreEl = document.getElementById('score');
        this.comboEl = document.getElementById('combo');
        this.levelEl = document.getElementById('level');
    }
    updateUI() {
        this.scoreEl.innerText = this.game.score;
        this.comboEl.innerText = this.game.combo;
        this.levelEl.innerText = this.game.level;
    }
    draw(ctx) {
        const timeLeft = Math.max(0, this.game.songData.duration - this.game.elapsedTime);
        const mins = Math.floor(timeLeft / 60);
        const secs = Math.floor(timeLeft % 60).toString().padStart(2, '0');
        ctx.font = "20px monospace"; ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.fillText(`TIME: ${mins}:${secs}`, 400, 30);

        // Draw Phase Label
        const currentSeg = this.game.songData.segments.find(s => this.game.elapsedTime >= s.start && this.game.elapsedTime < s.end);
        if (currentSeg) {
            ctx.font = "bold 16px Arial"; ctx.fillStyle = "#FFD700"; ctx.textAlign = "center";
            ctx.fillText(currentSeg.label.toUpperCase(), 400, 55);
        }
    }
}
