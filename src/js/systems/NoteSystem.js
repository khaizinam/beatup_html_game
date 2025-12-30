import { MODE_MAP, DIFFICULTY_CONFIG } from '../constants.js';

export default class NoteSystem {
    constructor(game) {
        this.game = game;
        this.sequence = [];
        this.inputIndex = 0;
    }
    generateSequence() {
        this.sequence = [];
        this.inputIndex = 0;

        // Difficulty Logic
        let baseCount = 3 + Math.floor(this.game.level / 2);
        const diff = DIFFICULTY_CONFIG[this.game.config.diff];
        const count = Math.min(9, baseCount + diff.noteCountBonus);

        const pool = MODE_MAP[this.game.config.mode];
        for (let i = 0; i < count; i++) {
            const k = pool[Math.floor(Math.random() * pool.length)];
            this.sequence.push({ key: k, state: 'PENDING' });
        }
        if (this.sequence.length > 0) this.sequence[0].state = 'ACTIVE';
    }
    hasPendingNotes() { return this.sequence.some(n => n.state !== 'DONE'); }
    reset() { this.sequence = []; this.inputIndex = 0; }

    handleInput(code) {
        if (this.sequence.length === 0) return;
        if (this.inputIndex >= this.sequence.length) return; // Guard: Sequence complete
        const currentNote = this.sequence[this.inputIndex];
        if (code === currentNote.key) {
            currentNote.state = 'DONE';
            this.inputIndex++;
            this.game.audioSystem.playKey();
            if (this.inputIndex < this.sequence.length) {
                this.sequence[this.inputIndex].state = 'ACTIVE';
            }
        } else {
            this.inputIndex = 0;
            this.sequence.forEach(n => n.state = 'PENDING');
            if (this.sequence.length > 0) this.sequence[0].state = 'ACTIVE';
            this.game.triggerJudgement("RESET", "orange");
        }
    }

    updateAutoPlay() {
        if (this.sequence.length > 0 && this.inputIndex < this.sequence.length) {
            const currentNote = this.sequence[this.inputIndex];
            // Randomly hit notes fast
            if (Math.random() > 0.8 || this.inputIndex === 0) {
                this.handleInput(currentNote.key);
            }
        }
    }

    isComplete() { return this.sequence.length > 0 && this.inputIndex === this.sequence.length; }

    draw(ctx) {
        const startX = 400 - (this.sequence.length * 40);
        const y = 300;
        this.sequence.forEach((note, i) => {
            const x = startX + i * 80;
            ctx.save(); ctx.translate(x, y);
            if (note.state === 'DONE') ctx.fillStyle = '#0f0';
            else if (note.state === 'ACTIVE') ctx.fillStyle = '#fff';
            else ctx.fillStyle = '#555';
            this.drawArrow(ctx, note.key);
            ctx.restore();
        });
    }
    drawArrow(ctx, key) {
        ctx.font = "bold 40px Arial"; ctx.textAlign = "center";
        let char = "?";
        if (key === 'ArrowUp') char = "↑";
        if (key === 'ArrowDown') char = "↓";
        if (key === 'ArrowLeft') char = "←";
        if (key === 'ArrowRight') char = "→";
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) char = key.replace('Key', '');
        ctx.strokeStyle = "black"; ctx.lineWidth = 3;
        ctx.strokeText(char, 0, 10); ctx.fillText(char, 0, 10);
    }
}
