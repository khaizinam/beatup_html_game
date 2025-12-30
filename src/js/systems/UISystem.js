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
        ctx.font = "20px monospace"; ctx.fillStyle = "#fff"; ctx.textAlign = "right";
        ctx.fillText(`TIME: ${mins}:${secs}`, 780, 50);

        // Draw Phase Label
        // Phase logic is in Game class, but we can access via game.currentPhaseIdx?
        // Actually in game.js logic, checkPhase updates things but where is `currentPhaseIdx`?
        // Ah, I need to make sure Game class exports or properties are accessible.
        // Let's assume Game passes current phase label or handles it. 
        // For now, let's look at how original game.js did it.
        // Original used PHASES[this.game.currentPhaseIdx], so we need that.
    }
}
