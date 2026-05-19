import { BOARD_WIDTH, SCORING, INITIAL_LEVEL, LINES_PER_LEVEL } from './constants.js';
import { getRandomTetromino, getTetromino } from './pieces.js';

const BEST_SCORE_KEY = 'tetris.bestScore';

/**
 * Load the best score from localStorage.
 * @returns {number}
 */
export function loadBestScore() {
  return parseInt(localStorage.getItem(BEST_SCORE_KEY), 10) || 0;
}

/**
 * Persist the best score to localStorage if it improved.
 * Mutates `state.bestScore` in place and writes to localStorage.
 * @param {object} state
 */
export function checkBestScore(state) {
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    localStorage.setItem(BEST_SCORE_KEY, String(state.score));
  }
}

/**
 * Reset the best score in memory and localStorage.
 * @param {object} state
 */
export function resetBestScore(state) {
  state.bestScore = 0;
  localStorage.removeItem(BEST_SCORE_KEY);
}

/**
 * Game state container.
 *
 * Shape:
 *   score       – number
 *   level       – number
 *   lines       – total accumulated cleared lines
 *   paused      – boolean
 *   gameOver    – boolean
 *   activePiece – { name, color, shape, x, y } or null
 *   nextPiece   – { name, color, shape, x, y } or null
 *   heldPiece   – { name, color, shape, x, y } or null
 *   canHold     – boolean (once per piece)
 */

/**
 * Spawn a piece at the top-center of the board.
 * @returns {object} { name, color, shape, x, y }
 */
export function spawnPiece() {
  const tet = getRandomTetromino();
  const shape = tet.shapes[0];
  const y = 0;
  const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  return { name: tet.name, color: tet.color, shape, x, y };
}

/**
 * Create a fresh game state.
 * @returns {object}
 */
export function createInitialState(bestScore) {
  const active = spawnPiece();
  const next = spawnPiece();
  return {
    score: 0,
    level: INITIAL_LEVEL,
    lines: 0,
    paused: false,
    gameOver: false,
    bestScore: bestScore ?? 0,
    activePiece: active,
    nextPiece: next,
    heldPiece: null,
    canHold: true,
  };
}

/**
 * Reset / restart the game state.
 * @returns {object} Fresh game state.
 */
export function resetGameState(state) {
  const best = state ? state.bestScore : 0;
  return createInitialState(best);
}

/**
 * Toggle paused flag. No-op when game is over.
 * @param {object} state
 * @returns {boolean} New paused value.
 */
export function togglePause(state) {
  if (state.gameOver) return state.paused;
  state.paused = !state.paused;
  return state.paused;
}

/**
 * Mark the game as over.
 * @param {object} state
 */
export function setGameOver(state) {
  state.gameOver = true;
}

/**
 * Apply line-clear scoring and level progression.
 *
 * Scoring (per Tetris V1):
 *   1 line: +100 × level
 *   2 lines: +300 × level
 *   3 lines: +500 × level
 *   4 lines: +800 × level
 *
 * Level increases every LINES_PER_LEVEL total cleared lines.
 *
 * Mutates `state` in place.
 * @param {object} state
 * @param {number} linesCleared – number of lines just cleared (1-4).
 */
export function applyLineClear(state, linesCleared) {
  const key = linesCleared === 4 ? 'FOUR_LINES' :
              linesCleared === 3 ? 'THREE_LINES' :
              linesCleared === 2 ? 'TWO_LINES' :
              linesCleared === 1 ? 'ONE_LINE' : null;

  if (!key) return;

  state.score += SCORING[key] * state.level;
  state.lines += linesCleared;

  const newLevel = Math.floor(state.lines / LINES_PER_LEVEL) + INITIAL_LEVEL;
  if (newLevel !== state.level) {
    state.level = newLevel;
  }
}

/**
 * Set the active piece.
 * @param {object} state
 * @param {object|null} piece – piece object or null to clear.
 */
export function setActivePiece(state, piece) {
  state.activePiece = piece;
}

/**
 * Set the next piece.
 * @param {object} state
 * @param {object} piece – piece object.
 */
export function setNextPiece(state, piece) {
  state.nextPiece = piece;
}

/**
 * Perform a hold/swap action.
 *
 * - If canHold is false, nothing happens.
 * - If heldPiece is null: store activePiece in heldPiece, spawn a fresh piece as active.
 * - If heldPiece exists: swap activePiece with heldPiece (active gets a fresh spawn position).
 *
 * Mutates `state` in place. Returns true if action was performed.
 * @param {object} state
 * @returns {boolean}
 */
export function performHold(state) {
  if (!state.canHold || state.gameOver || state.paused || !state.activePiece) {
    return false;
  }

  const currentActive = state.activePiece;
  // Reset canHold so repeated C presses do nothing this piece lifetime
  state.canHold = false;

  if (!state.heldPiece) {
    // Store current piece in hold (full renderable object), spawn a new active from nextPiece queue
    const shape = getTetromino(currentActive.name).shapes[0];
    state.heldPiece = { name: currentActive.name, color: currentActive.color, shape };
    const next = state.nextPiece;
    if (next) {
      setActivePiece(state, next);
      setNextPiece(state, spawnPiece());
    }
  } else {
    // Swap: store current active in hold (full renderable object), activate previous held piece at fresh position
    const held = state.heldPiece;
    const holdShape = getTetromino(currentActive.name).shapes[0];
    state.heldPiece = { name: currentActive.name, color: currentActive.color, shape: holdShape };
    const activeShape = getTetromino(held.name).shapes[0];
    const y = 0;
    const x = Math.floor((BOARD_WIDTH - activeShape[0].length) / 2);
    state.activePiece = { name: held.name, color: held.color, shape: activeShape, x, y };
  }

  return true;
}

/**
 * Reset hold state when a new piece spawns after lock.
 * @param {object} state
 */
export function resetHold(state) {
  state.canHold = true;
}
