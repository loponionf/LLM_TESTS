// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

// Scoring
export const SCORING = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

// Level progression
export const INITIAL_LEVEL = 1;
export const LINES_PER_LEVEL = 10;

// Gravity timing (ms per drop at level 1)
export const GRAVITY_BASE = 1000;
export const GRAVITY_DECAY = 0.85; // multiplier per level

// Key bindings
export const KEYS = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  UP: "ArrowUp",
  SPACE: "Space",
};
