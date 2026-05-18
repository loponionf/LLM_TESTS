import { isValidPosition } from './board.js';
import { getTetromino } from './pieces.js';

/**
 * Movement helpers for the active piece.
 * Mutates `state.activePiece` in place when the move is valid.
 *
 * @param {Array<Array|null>} board
 * @param {object} state
 */
export function moveLeft(board, state) {
  const p = state.activePiece;
  if (!p) return;
  if (isValidPosition(board, p, p.x - 1, p.y, p.rotationIndex || 0)) {
    p.x -= 1;
  }
}

/**
 * Move the active piece one column right.
 */
export function moveRight(board, state) {
  const p = state.activePiece;
  if (!p) return;
  if (isValidPosition(board, p, p.x + 1, p.y, p.rotationIndex || 0)) {
    p.x += 1;
  }
}

/**
 * Move the active piece one row down.
 */
export function moveDown(board, state) {
  const p = state.activePiece;
  if (!p) return;
  if (isValidPosition(board, p, p.x, p.y + 1, p.rotationIndex || 0)) {
    p.y += 1;
  }
}

/**
 * Move the active piece to the lowest valid row (hard drop).
 */
export function hardDrop(board, state) {
  const p = state.activePiece;
  if (!p) return;
  while (isValidPosition(board, p, p.x, p.y + 1, p.rotationIndex || 0)) {
    p.y += 1;
  }
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
}

/**
 * Return the current shape matrix of the active piece.
 */
export function getActiveShape(state) {
  const p = state.activePiece;
  if (!p) return null;
  const rot = p.rotationIndex || 0;
  const def = getTetromino(p.name);
  return (def && def.shapes[rot]) || p.shape;
}
