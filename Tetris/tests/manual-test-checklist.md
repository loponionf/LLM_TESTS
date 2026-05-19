# Tetris V1 — Manual Validation Checklist

> **How to use**: Open `Tetris/index.html` in a browser (double-click or serve via a static server). Go through each item and mark it done.

---

## 0. App loads

- [ ] Opening `Tetris/index.html` (or a static server serving the same files) renders the game UI without JavaScript errors in the console.

## 1. Required DOM IDs

- [ ] Element with id `board` exists and is a `<canvas>`.
- [ ] Element with id `score` exists and displays a number.
- [ ] Element with id `level` exists and displays a number.
- [ ] Element with id `lines` exists and displays a number.
- [ ] Element with id `next-piece` exists and is a `<canvas>`.
- [ ] Element with id `pause-btn` exists and is a `<button>`.
- [ ] Element with id `restart-btn` exists and is a `<button>`.
- [ ] Element with id `game-over` exists.

## 2. Board

- [ ] The board canvas is 300×600 pixels (10 columns × 20 rows at 30 px/cell).
- [ ] A dark background grid is visible on the board.

## 3. Tetrominoes

- [ ] All 7 tetromino shapes (I, O, T, S, Z, J, L) appear during gameplay (play long enough or observe the next-piece preview across spawns).
- [ ] Each tetromino has a distinct, recognizable color:
  - I: cyan `#00f0f0`
  - O: yellow `#f0f000`
  - T: purple `#a000f0`
  - S: green `#00f000`
  - Z: red `#f00000`
  - J: blue `#0000f0`
  - L: orange/brown `#f0a000`

## 4. Controls — Movement

- [ ] **ArrowLeft** moves the active piece one column left (blocked by walls and locked pieces).
- [ ] **ArrowRight** moves the active piece one column right (blocked by walls and locked pieces).
- [ ] **ArrowDown** (soft drop) moves the active piece one row down per press.
- [ ] **ArrowUp** rotates the active piece 90° clockwise (cycles through all rotation states).
- [ ] **Space** (hard drop) instantly drops the piece to the lowest valid position and locks it.

## 5. Scoring

- [ ] Clearing 1 line adds 100 points (× current level).
- [ ] Clearing 2 lines adds 300 points (× current level).
- [ ] Clearing 3 lines adds 500 points (× current level).
- [ ] Clearing 4 lines (Tetris) adds 800 points (× current level).
- [ ] The score HUD (`#score`) updates immediately after each line clear.

## 6. Level progression

- [ ] Every 10 cleared lines increases the level by 1.
- [ ] The level HUD (`#level`) reflects the new level.
- [ ] Gravity speed increases as the level rises (pieces fall faster).
- [ ] At level 1, gravity delay is ~1000 ms; at higher levels it decreases by 50 ms per level, capping at 100 ms.

## 7. Next-piece preview

- [ ] The next piece canvas (`#next-piece`) shows the upcoming tetromino centered in the preview area.
- [ ] The preview updates when a new piece is generated (after locking the current one).

## 8. Pause / Resume

- [ ] Pressing **Space** toggles pause (via `#pause-btn` click or key — whichever is wired).
- [ ] While paused, the piece stops falling and no gravity ticks occur.
- [ ] Resuming from pause continues the game from the exact same state.
- [ ] Pause does not work when the game is over.

## 9. Restart

- [ ] Clicking `#restart-btn` resets score, level, lines, and board to initial values.
- [ ] A fresh active piece and next piece are spawned.
- [ ] The gravity loop restarts at level 1 speed.
- [ ] The game-over overlay is hidden after restart.

## 10. Game-over behavior

- [ ] When a newly spawned piece collides immediately, the game ends.
- [ ] The `#game-over` overlay displays "GAME OVER".
- [ ] No further input (movement, rotation, drop) affects the board after game over.
- [ ] Restart is still possible after game over.

## 11. Help panel

- [ ] A help/controls panel is visible on the page.
- [ ] It lists: Left, Right, Soft drop, Rotate, Hard drop with their key bindings.

## 12. Ghost piece

- [ ] A translucent ghost piece is visible on the board, showing where the active piece will land.
- [ ] The ghost aligns with the hard-drop landing position (pressing Space drops to exactly the ghost row).
- [ ] The ghost updates in real time as the piece moves horizontally or rotates.

## 13. Source separation

- [ ] `index.html` contains only the page shell + script/module tags.
- [ ] `js/constants.js` holds board dimensions, scoring, gravity, key bindings.
- [ ] `js/pieces.js` defines all 7 tetrominoes with shapes and colors.
- [ ] `js/board.js` handles grid creation, collision, locking, line clearing.
- [ ] `js/gameState.js` manages score, level, lines, pause, game-over, next-piece.
- [ ] `js/renderer.js` contains all canvas drawing and HUD update logic.
- [ ] `js/input.js` handles keyboard and button events only.
- [ ] `js/gameLoop.js` manages gravity timing, ghost computation, and lock-and-spawn flow.
- [ ] `js/main.js` bootstraps the game and wires modules together.

---

## Known limitations / follow-ups (not in scope for V1)

- No hold piece mechanic.
- No high score persistence.
- No sound effects or music.
- No visual animations (line clear flash, piece landing bounce, etc.).
- No theme customization.
- No external dependencies or build step.
- No wall-kick system for rotations near walls.
