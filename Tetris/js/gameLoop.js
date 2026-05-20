import {
  GRAVITY_INITIAL,
  GRAVITY_MIN,
  GRAVITY_STEP,
  LOCK_DELAY_MS,
} from './constants.js';
import { isValidPosition, lockPiece as lockPieceBoard, clearLines } from './board.js';
import { getTetromino } from './pieces.js';
import { getRandomTetromino } from './pieces.js';
import { applyLineClear, setActivePiece, setNextPiece, setGameOver, resetHold } from './gameState.js';

/**
 * Movement helpers for the active piece.
 * Mutates `state.activePiece` in place when the move is valid.
 *
 * The active piece has { name, color, shape, x, y } but
 * isValidPosition expects a definition with { name, color, shapes[], ... }.
 * We look up the full tetromino definition for collision checks
 * while mutating only the active piece fields.
 *
 * @param {Array<Array|null>} board
 * @param {object} state
 */
export function moveLeft(board, state) {
  const p = state.activePiece;
  if (!p) return;
  const def = getTetromino(p.name);
  if (!def) return;
  if (isValidPosition(board, def, p.x - 1, p.y, p.rotationIndex || 0)) {
    p.x -= 1;
  }
  // Moving a grounded piece (valid or invalid) resets the lock delay
  if (state.isGrounded) {
    startOrRestartLockDelayTimer(board, state);
  }
}

/**
 * Move the active piece one column right.
 */
export function moveRight(board, state) {
  const p = state.activePiece;
  if (!p) return;
  const def = getTetromino(p.name);
  if (!def) return;
  if (isValidPosition(board, def, p.x + 1, p.y, p.rotationIndex || 0)) {
    p.x += 1;
  }
  // Moving a grounded piece (valid or invalid) resets the lock delay
  if (state.isGrounded) {
    startOrRestartLockDelayTimer(board, state);
  }
}

/**
 * Move the active piece one row down.
 * If the piece cannot move further down, mark it as grounded and
 * start (or restart) the lock delay timer.
 */
export function moveDown(board, state) {
  const p = state.activePiece;
  if (!p) return;
  const def = getTetromino(p.name);
  if (!def) return;
  if (isValidPosition(board, def, p.x, p.y + 1, p.rotationIndex || 0)) {
    // Moved down — no longer grounded, clear any pending lock delay
    state.isGrounded = false;
    state.lockDelayStart = null;
    clearLockDelayTimer();
    p.y += 1;
  } else {
    // Cannot move down — piece is grounded
    markGrounded(board, state);
  }
}

/**
 * Move the active piece to the lowest valid row and lock it.
 * Hard drop bypasses lock delay and locks immediately.
 */
export function hardDrop(board, state) {
  const p = state.activePiece;
  if (!p) return;
  const def = getTetromino(p.name);
  if (!def) return;
  while (isValidPosition(board, def, p.x, p.y + 1, p.rotationIndex || 0)) {
    p.y += 1;
  }
  // Hard drop: clear lock delay state and lock immediately
  clearLockDelayTimer();
  state.isGrounded = false;
  state.lockDelayStart = null;
  lockAndSpawn(board, state);
}

/**
 * Rotate the active piece one step clockwise.
 * Looks up the full tetromino definition to get the next rotation shape.
 */
export function rotatePiece(board, state) {
  const p = state.activePiece;
  if (!p) return;
  const def = getTetromino(p.name);
  if (!def) return;
  const currentRot = p.rotationIndex || 0;
  const nextRot = (currentRot + 1) % def.shapes.length;
  if (isValidPosition(board, def, p.x, p.y, nextRot)) {
    p.rotationIndex = nextRot;
    p.shape = def.shapes[nextRot];
  }
  // Rotating a grounded piece (valid or invalid) resets the lock delay
  if (state.isGrounded) {
    startOrRestartLockDelayTimer(board, state);
  }
}

/**
 * Spawn a new active piece from a given tetromino definition.
 * Centers it at the top of the board.
 *
 * @param {object} tet - Full tetromino definition (with .shapes).
 * @returns {object} { name, color, shape, x, y }
 */
function createPiece(tet) {
  const shape = tet.shapes[0];
  const y = 0;
  const x = Math.floor((10 - shape[0].length) / 2);
  return { name: tet.name, color: tet.color, shape, x, y };
}

/**
 * Lock the active piece, clear lines, update score/level,
 * promote nextPiece to activePiece, generate a new nextPiece,
 * and detect game over.
 *
 * @param {Array<Array|null>} board
 * @param {object} state
 */
export function lockAndSpawn(board, state) {
  const p = state.activePiece;
  if (!p) return;

  // 1. Lock the piece into the board
  const def = getTetromino(p.name);
  if (!def) return;
  lockPieceBoard(board, def, p.x, p.y, p.rotationIndex || 0);

  // 2. Clear completed lines
  const linesCleared = clearLines(board);

  // 3. Update score and level
  if (linesCleared > 0) {
    applyLineClear(state, linesCleared);
  }

  // 4. Promote nextPiece to activePiece
  const newActive = state.nextPiece;
  if (!newActive) {
    setActivePiece(state, null);
    return;
  }

  // 5. Generate a new nextPiece
  const newNext = createPiece(getRandomTetromino());
  setNextPiece(state, newNext);
  setActivePiece(state, newActive);

  // 6. Reset hold availability for the new active piece
  resetHold(state);

  // 7. Detect game over: if the newly spawned piece collides immediately
  const freshDef = getTetromino(newActive.name);
  if (freshDef && !isValidPosition(board, freshDef, newActive.x, newActive.y, newActive.rotationIndex || 0)) {
    setGameOver(state);
  }

  // Clear lock delay state for the newly spawned piece
  clearLockDelayTimer();
  state.isGrounded = false;
  state.lockDelayStart = null;

  // The next queue is auto-maintained by the BagRandomizer; no extra work needed here.
}

// Module-level timeout id for the lock delay timer.
let lockDelayTimeoutId = null;

// Module-level reference to the latest refresh callback, used by the
// lock-delay timeout path so it can re-render after locking.
let latestRefreshCallback = null;

/**
 * Clear any pending lock delay timeout.
 */
function clearLockDelayTimer() {
  if (lockDelayTimeoutId !== null) {
    clearTimeout(lockDelayTimeoutId);
    lockDelayTimeoutId = null;
  }
}

/**
 * Mark the active piece as grounded and start (or restart) the
 * setTimeout-based lock delay. When the timeout fires, lock the
 * piece and spawn a new one — independent of gravity tick timing.
 *
 * @param {Array<Array|null>} board
 * @param {object} state
 */
function markGrounded(board, state) {
  state.isGrounded = true;
  startOrRestartLockDelayTimer(board, state);
}

/**
 * Start or restart the lock delay setTimeout.
 * If a timer is already running, it is cleared and restarted.
 *
 * @param {Array<Array|null>} board
 * @param {object} state
 */
function startOrRestartLockDelayTimer(board, state) {
  clearLockDelayTimer();
  state.lockDelayStart = Date.now();
  lockDelayTimeoutId = setTimeout(() => {
    lockDelayTimeoutId = null;
    // Only lock if conditions are still valid
    if (state.paused || state.gameOver || !state.activePiece) return;
    const p = state.activePiece;
    if (!p) return;
    const def = getTetromino(p.name);
    if (!def) return;
    // Verify the piece is still grounded (hasn't been nudged)
    if (!state.isGrounded) return;
    if (isValidPosition(board, def, p.x, p.y + 1, p.rotationIndex || 0)) return;
    lockAndSpawn(board, state);
    if (latestRefreshCallback) latestRefreshCallback();
  }, LOCK_DELAY_MS);
}

/**
 * Compute the landing position for the active piece (ghost).
 * Simulates downward movement without mutating state.activePiece.
 *
 * @param {Array<Array|null>} board
 * @param {object} state - Game state object.
 * @returns {{x: number, y: number}|null} Ghost grid position or null.
 */
export function computeGhostPosition(board, state) {
  const p = state.activePiece;
  if (!p) return null;
  const def = getTetromino(p.name);
  if (!def) return null;

  let ghostY = p.y;
  while (isValidPosition(board, def, p.x, ghostY + 1, p.rotationIndex || 0)) {
    ghostY += 1;
  }
  return { x: p.x, y: ghostY };
}

/**
 * Compute the gravity delay in ms for a given level.
 * @param {number} level
 * @returns {number}
 */
export function getGravityDelay(level) {
  return Math.max(GRAVITY_MIN, GRAVITY_INITIAL - (level - 1) * GRAVITY_STEP);
}

/**
 * Start the automatic gravity loop.
 * Each tick attempts to move the active piece down; if it cannot,
 * the lock delay timer (independent of gravity) will handle locking.
 *
 * @param {Array<Array|null>} board
 * @param {object} state - Game state object (read for paused/gameOver/level).
 * @param {Function} refresh - Re-render function.
 */
export function startGravityLoop(board, state, refresh) {
  stopGravityLoop();
  latestRefreshCallback = refresh;
  const delay = getGravityDelay(state.level);
  gravityLoopLevel = state.level;
  gravityIntervalId = setInterval(() => {
    if (state.paused || state.gameOver || !state.activePiece) return;
    moveDown(board, state);
    refresh();
    if (state.level !== gravityLoopLevel && !state.paused && !state.gameOver) {
      restartGravityLoop(board, state, refresh);
    }
  }, delay);
}

/**
 * Stop the automatic gravity loop.
 */
export function stopGravityLoop() {
  if (gravityIntervalId !== null) {
    clearInterval(gravityIntervalId);
    gravityIntervalId = null;
  }
  gravityLoopLevel = null;
  latestRefreshCallback = null;
  clearLockDelayTimer();
}

/**
 * Restart the gravity loop with the current level's speed.
 * Stops any existing interval first.
 *
 * @param {Array<Array|null>} board
 * @param {object} state - Game state object.
 * @param {Function} refresh - Re-render function.
 */
export function restartGravityLoop(board, state, refresh) {
  stopGravityLoop();
  startGravityLoop(board, state, refresh);
}

// Module-level interval id and level tracker for the gravity loop.
let gravityIntervalId = null;
let gravityLoopLevel = null;
