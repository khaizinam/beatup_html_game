# Game Scenario: BeatUp (Audition Style)

## Game Title
BeatUp Web Edition

## Game Description
A high-intensity rhythm game inspired by the "Beat Up" mode from *Audition Online*. Players must input a sequence of arrow keys (or numpad keys) displayed on the screen and finish the sequence by pressing specific keys at the exact moment a visual beat counter reaches the "Zone".

## Core Mechanics

### 1. The Play Area
- **Beat Bar**: A horizontal progress bar in the center of the screen.
- **Beat Ball**: A ball/indicator moves from Left to Right across the Beat Bar.
- **The Zone (Success Area)**: A highlighted section at the right end of the Beat Bar. The player must complete the input sequence and press the **FINISHER KEY** (usually SPACE) when the Beat Ball is inside this zone.
- **Note Display**: Arrows appear on the screen (usually splitting into 6 lanes or floating near the character in the original, but here we can align them centrally or rhythmically).

### 2. Gameplay Loop
1. **Measure Start**: The Beat Ball starts moving from Left to Right.
2. **Input Phase**: A sequence of arrows appears `(e.g., UP, DOWN, LEFT, RIGHT)`.
3. **Player Action**: The player must press the corresponding arrow keys in the correct order.
    - Correct Input: Arrow lights up/disappears.
    - Incorrect Input: Penalty (Reset sequence or miss score).
4. **Finisher Phase**: Once the sequence is complete, the player waits for the Beat Ball to reach the **The Zone**.
5. **Crit/BeatUp**: Press **SPACE** exactly when the ball is in the center of the Zone.

### 3. Difficulty & Speed
- **BPM (Beats Per Minute)**: Controls the speed of the Beat Ball.
- **Levels**:
    - **Lv 1-5**: Slower ball, shorter sequences (3-5 keys).
    - **Lv 6-9**: Faster ball, longer sequences (6-9 keys).
    - **Chance**: Sometimes the red "Chance" key appears (reverse input) - *Optional for later*.

### 4. Modes

#### 4K Mode
- **Inputs**: Arrow Keys (Up, Down, Left, Right).
- **Finisher**: Space Bar.

#### 8K Mode
- **Inputs**: Numpad representation (1, 2, 3, 4, 6, 7, 8, 9) or simulated via standard keys:
    - 7 (Q/U) | 8 (W/I) | 9 (E/O)
    - 4 (A/J) |         | 6 (D/L)
    - 1 (Z/M) | 2 (X/,) | 3 (C/.)
- **Finisher**: Space Bar.

### 5. Scoring System
Based on when the Space Bar is pressed relative to the center of the "Zone":
- **Perfect / BeatUp**: Exact center. (+500-1000 pts)
- **Great**: Slightly off-center. (+300 pts)
- **Cool**: Inside the zone but edge. (+100 pts)
- **Bad**: Outside the zone or sequence incomplete. (0 pts, breaks combo)
- **Miss**: Timeout or wrong finisher. (0 pts, breaks combo)

Combo multiplier applies for consecutive Perfect/Great/Cool.

## Visual Style (Canvas Only)
- **Background**: Dark, neon grid or abstract visualizer.
- **UI**:
    - **Score**: Top Right.
    - **Combo**: Center (Large, pulsating).
    - **Beat Bar**: Shiny, metallic or neon glowing bar.
    - **Arrows**:
        - default: Gray/White outline.
        - active: Green/Blue glow.
        - miss: Red.