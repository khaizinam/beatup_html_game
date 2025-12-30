export const KEYS = {
    UP: 'ArrowUp', DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft', RIGHT: 'ArrowRight',
    SPACE: 'Space', ESC: 'Escape'
};

export const MODE_MAP = {
    '4K': ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'],
    '8K': ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'KeyA', 'KeyS', 'KeyD', 'KeyF']
};

export const PHASES = [
    { time: 0, bpm: 100, label: "PHASE 1: WARM UP" },
    { time: 75, bpm: 130, label: "PHASE 2: HEATING UP" },     // 1:15
    { time: 150, bpm: 160, label: "PHASE 3: HIGH SPEED" },     // 2:30
    { time: 225, bpm: 190, label: "PHASE 4: BEAT UP MODE" },   // 3:45
    { time: 300, bpm: 0, label: "FINISH" }                   // 5:00
];

export const DIFFICULTY_CONFIG = {
    'EASY': { noteCountBonus: -1, speedMultiplier: 0.6 },
    'NORMAL': { noteCountBonus: 0, speedMultiplier: 1.0 },
    'HARD': { noteCountBonus: 1, speedMultiplier: 1.2 },
    'EXPERT': { noteCountBonus: 2, speedMultiplier: 1.5 }
};
