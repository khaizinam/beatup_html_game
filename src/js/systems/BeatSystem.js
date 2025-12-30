export default class BeatSystem {
    constructor(game) {
        this.game = game;
        this.measureProgress = 0;
        this.bpm = 100;
        this.measureDuration = 2400;

        this.barX = 100; this.barY = 500; this.barW = 600;
        this.targetPercent = 0.85; this.zoneWidth = 0.10;
    }
    updateSpeed(bpm) {
        this.bpm = bpm;
        this.measureDuration = (60 * 1000 / this.bpm) * 4;
    }
    update(dt) {
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
            const diff = Math.abs(this.measureProgress - this.targetPercent);
            if (diff < 0.005) { // Super precise
                this.game.triggerJudgement("PERFECT", "#0ff");
                this.game.noteSystem.reset();
                this.game.audioSystem.play('space');
            }
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#333';
        ctx.fillRect(this.barX, this.barY, this.barW, 10);

        const zoneStart = this.barX + (this.targetPercent - this.zoneWidth / 2) * this.barW;
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fillRect(zoneStart, this.barY - 5, this.zoneWidth * this.barW, 20);

        const perfectX = this.barX + this.targetPercent * this.barW;
        ctx.fillStyle = '#fff';
        ctx.fillRect(perfectX - 1, this.barY - 10, 2, 30);

        const ballX = this.barX + (this.measureProgress * this.barW);
        ctx.beginPath();
        ctx.arc(ballX, this.barY + 5, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#0ff'; ctx.shadowBlur = 10; ctx.shadowColor = '#0ff';
        ctx.fill(); ctx.shadowBlur = 0;

        if (Math.abs(this.measureProgress - this.targetPercent) < this.zoneWidth / 2) {
            ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
        }
    }
    checkTiming() {
        const diff = Math.abs(this.measureProgress - this.targetPercent);
        if (diff < 0.01) return 'PERFECT';
        if (diff < 0.03) return 'GREAT';
        if (diff < 0.06) return 'COOL';
        if (diff < 0.10) return 'BAD';
        return 'MISS';
    }
}
