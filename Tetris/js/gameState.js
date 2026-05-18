import { BOARD_WIDTH, SCORING, INITIAL_LEVEL, LINES_PER_LEVEL } from './constants.js';
import { getRandomTetromino } from './pieces.js';

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
 */

/**
 * Spawn a piece at the top-center of the board.
 * @returns {object} { name, color, shape, x, y }
 */
function spawnPiece() {
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
export function createInitialState() {
  const active = spawnPiece();
  const next = spawnPiece();
  return {
    score: 0,
    level: INITIAL_LEVEL,
    lines: 0,
    paused: false,
    gameOver: false,
    activePiece: active,
    nextPiece: next,
  };
}

/**
 * Reset / restart the game state.
 * @returns {object} Fresh game state.
 */
export function resetGameState() {
  return createInitialState();
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
