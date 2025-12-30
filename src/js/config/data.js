export const SONG_LIST = [
    {
        id: 'sorry_bao_thi',
        name: 'Sorry - Bảo Thy',
        file: 'public/music/sorry_bao_thi.mp3',
        duration: 240, // 4:00
        segments: [
            { start: 0, end: 60, mode: 1, bpm: 100, label: "Warm Up" },
            { start: 60, end: 120, mode: 2, bpm: 130, label: "Normal" },
            { start: 120, end: 180, mode: 3, bpm: 160, label: "Fast" },
            { start: 180, end: 240, mode: 4, bpm: 190, label: "Super Fast" }
        ]
    },
    {
        id: 'song1', name: 'Upbeat Groove', file: 'public/audio/song1.mp3', duration: 300,
        segments: [
            { start: 0, end: 60, bpm: 100, label: "Intro" },
            { start: 60, end: 120, bpm: 120, label: "Verse 1" },
            { start: 120, end: 180, bpm: 140, label: "Chorus" },
            { start: 180, end: 240, bpm: 160, label: "Bridge" },
            { start: 240, end: 300, bpm: 180, label: "Outro" }
        ]
    },
    {
        id: 'song2', name: 'Chill Beat', file: 'public/audio/song2.mp3', duration: 240,
        segments: [
            { start: 0, end: 40, bpm: 80, label: "Intro" },
            { start: 40, end: 100, bpm: 100, label: "Main" },
            { start: 100, end: 160, bpm: 110, label: "Build Up" },
            { start: 160, end: 240, bpm: 120, label: "Climax" }
        ]
    }
];
