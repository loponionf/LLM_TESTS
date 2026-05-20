// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

// Scoring values
export const SCORING = {
  ONE_LINE: 100,
  TWO_LINES: 300,
  THREE_LINES: 500,
  FOUR_LINES: 800,
};

// Level progression
export const INITIAL_LEVEL = 1;
export const LINES_PER_LEVEL = 10;

// Gravity / timing (ms per gravity step at level 1)
export const GRAVITY_INITIAL = 1000;
export const GRAVITY_MIN = 100;
export const GRAVITY_STEP = 50; // ms faster per level

// Lock delay: time (ms) a grounded piece waits before auto-locking.
// Hard drop bypasses this delay and locks immediately.
export const LOCK_DELAY_MS = 500;

// Key bindings
export const KEY_LEFT = 'ArrowLeft';
export const KEY_RIGHT = 'ArrowRight';
export const KEY_DOWN = 'ArrowDown';
export const KEY_UP = 'ArrowUp';
export const KEY_SPACE = ' ';
export const KEY_HOLD = 'c';
