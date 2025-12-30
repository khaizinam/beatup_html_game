export const SONG_LIST = [
    {
        id: 'sorry_bao_thi',
        name: 'Sorry - Bảo Thy',
        file: 'public/music/sorry_bao_thi.mp3',
        duration: 240, // 4:00
        segments: [
            { start: 0, end: 30, mode: 1, bpm: 100, label: "Warm Up" },
            { start: 30, end: 120, mode: 2, bpm: 130, label: "Normal" },
            { start: 120, end: 180, mode: 3, bpm: 160, label: "Fast" },
            { start: 180, end: 240, mode: 4, bpm: 190, label: "Super Fast" }
        ]
    },
    {
        id: 'khoc_dong_nhi',
        name: 'Khóc - Đông Nhi',
        file: 'public/music/Khoc-Dong-Nhi.mp3',
        duration: 240, // Estimated
        segments: [
            { start: 0, end: 30, mode: 1, bpm: 100, label: "Warm Up" },
            { start: 30, end: 120, mode: 2, bpm: 130, label: "Normal" },
            { start: 120, end: 180, mode: 3, bpm: 160, label: "Fast" },
            { start: 180, end: 240, mode: 4, bpm: 190, label: "Super Fast" }
        ]
    },
    {
        id: 'ten_minutes',
        name: '10 Minutes - Lee Hyori',
        file: 'public/music/10_minutes.mp3',
        duration: 160, // 2:40
        segments: [
            { start: 0, end: 30, mode: 1, bpm: 100, label: "Warm Up" },
            { start: 30, end: 80, mode: 2, bpm: 130, label: "Normal" },
            { start: 80, end: 120, mode: 3, bpm: 160, label: "Fast" },
            { start: 120, end: 160, mode: 4, bpm: 190, label: "Super Fast" }
        ]
    }
];
