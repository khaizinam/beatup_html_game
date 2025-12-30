export default class InputSystem {
    constructor(game) {
        this.game = game;
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    onKeyDown(e) {
        if (this.game.state === 'MENU' || this.game.state === 'GAMEOVER') return;

        if (e.code === 'Escape') {
            this.game.togglePause();
            return;
        }

        if (this.game.state !== 'PLAYING') return;

        if (e.code === 'Space') {
            if (this.game.noteSystem.isComplete()) {
                const judgement = this.game.beatSystem.checkTiming();
                let color = "white";
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
}
