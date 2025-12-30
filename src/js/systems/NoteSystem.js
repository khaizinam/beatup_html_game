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
        // Difficulty Logic
        let baseCount = 3;
        const lvl = this.game.level;

        if (lvl === 1) baseCount = 3;
        else if (lvl === 2) baseCount = 4 + (Math.random() > 0.5 ? 1 : 0);
        else if (lvl === 3) baseCount = 6;
        else if (lvl === 4) baseCount = 8;

        const diff = DIFFICULTY_CONFIG[this.game.config.diff];
        const count = Math.min(8, baseCount + diff.noteCountBonus); // Cap at 8 for consistency

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

        ctx.save();
        // Global text settings that don't change per note
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        this.sequence.forEach((note, i) => {
            const x = startX + i * 80;
            ctx.save();
            ctx.translate(x, y);
            this.drawNote(ctx, note);
            ctx.restore();
        });
        ctx.restore();
    }

    drawNote(ctx, note) {
        // Define colors per key
        const colors = {
            'ArrowLeft': { bg: '#FF5252', border: '#D32F2F', shadow: '#FF5252' }, // Red
            'ArrowDown': { bg: '#448AFF', border: '#1976D2', shadow: '#448AFF' }, // Blue
            'ArrowUp': { bg: '#FFCA28', border: '#F57C00', shadow: '#FFCA28' }, // Amber
            'ArrowRight': { bg: '#69F0AE', border: '#388E3C', shadow: '#69F0AE' }, // Green
            'default': { bg: '#9E9E9E', border: '#616161', shadow: '#9E9E9E' }
        };

        const style = colors[note.key] || colors['default'];

        let isDone = (note.state === 'DONE');
        let isActive = (note.state === 'ACTIVE');

        // Styles based on state
        let bgColor = style.bg;
        let borderColor = style.border;
        let shadowColor = style.shadow;
        let shadowBlur = 0;
        let alpha = 1.0;

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

        const size = 60;
        const half = size / 2;

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
        const char = this.getChar(note.key);
        ctx.font = "900 35px Arial"; // 900 weight (Black), slightly larger
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Text rendering
        ctx.shadowBlur = 0; // Ensure text is crisp

        // Stroke first (Outline) - Make it strong so it is visible on any background
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0, 0.8)'; // darker outline
        ctx.strokeText(char, 0, 2);

        // Fill second
        ctx.fillStyle = '#FFFFFF'; // White fill
        ctx.fillText(char, 0, 2);
    }

    getChar(key) {
        if (key === 'ArrowUp') return "↑";
        if (key === 'ArrowDown') return "↓";
        if (key === 'ArrowLeft') return "←";
        if (key === 'ArrowRight') return "→";
        return key.replace('Key', '');
    }
}
