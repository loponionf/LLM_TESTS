Tetris V1 - Project brief
=========================

Goal
----
Create a complete browser-based Tetris game while keeping the source code split into small, focused files so a local AI with limited context can implement the project incrementally.

The implementation must avoid a single large HTML/JS file. Each pull request should touch only the files needed for its issue.

Target runtime
--------------
- Plain browser application.
- No build step required for V1.
- No external framework.
- No external dependency unless explicitly approved by an issue.
- Open `index.html` directly in a browser.

Required final files
--------------------

Suggested structure:

- `Tetris/index.html`
  - Minimal page shell only.
  - Links CSS and JS modules.
  - Contains required DOM/canvas elements.

- `Tetris/css/styles.css`
  - Layout, buttons, HUD, overlay, and responsive styling.

- `Tetris/js/constants.js`
  - Board dimensions, cell size, scoring values, timings, colors, key bindings.

- `Tetris/js/pieces.js`
  - Tetromino definitions, colors, spawn data, rotation helpers if appropriate.

- `Tetris/js/board.js`
  - Board grid creation, collision checks, locking pieces, line clearing.

- `Tetris/js/gameState.js`
  - Score, level, lines, pause state, game-over state, next-piece state, restart/reset state.

- `Tetris/js/renderer.js`
  - Canvas drawing only: board, active piece, next piece, HUD refresh helpers.

- `Tetris/js/input.js`
  - Keyboard and button handling only.

- `Tetris/js/gameLoop.js`
  - Timing loop, gravity, update cycle, pause/resume/restart coordination.

- `Tetris/js/main.js`
  - Application bootstrap and module wiring only.

- `Tetris/tests/manual-test-checklist.md`
  - Manual validation checklist for V1.

Required gameplay
-----------------
- Board: 10 columns x 20 rows.
- Tetrominoes: I, O, T, S, Z, J, L.
- Each tetromino has a distinct color.
- Controls:
  - ArrowLeft: move left.
  - ArrowRight: move right.
  - ArrowDown: soft drop.
  - ArrowUp: rotate.
  - Space: hard drop.
- Display:
  - Main board canvas.
  - Score.
  - Level.
  - Cleared lines.
  - Next piece preview.
  - Pause button.
  - Restart button.
  - Game-over overlay/message.
- Scoring:
  - 1 line: 100 points.
  - 2 lines: 300 points.
  - 3 lines: 500 points.
  - 4 lines: 800 points.
- Level should increase as lines are cleared.
- Gravity should become faster as level increases.
- Pause and restart must work without reloading the page.

Required element IDs
--------------------
These IDs are required for validation and must exist in the final page:

- `board`
- `score`
- `level`
- `lines`
- `next-piece`
- `pause-btn`
- `restart-btn`
- `game-over`

Local AI implementation rules
-----------------------------
- One issue = one branch = one pull request.
- Read this file before editing.
- Inspect only the files relevant to the issue unless more context is truly needed.
- Keep changes small and focused.
- Do not rewrite unrelated files.
- Do not collapse the source into one large file.
- Do not add frameworks or bundlers.
- Do not claim manual validation was done unless it was actually performed.
- Include changed files and test/manual validation notes in every PR.

V1 acceptance summary
---------------------
Tetris V1 is complete when a user can open `Tetris/index.html` in a browser and play a stable Tetris game with the required controls, scoring, next-piece display, pause/restart, and game-over behavior, while the implementation remains cleanly split across the files above.
