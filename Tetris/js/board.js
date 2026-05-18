import { BOARD_WIDTH, BOARD_HEIGHT } from './constants.js';

/**
 * Board representation: 2D array [row][col], each cell is null (empty)
 * or an object { name: string, color: string } written by lockPiece.
 */

/**
 * Create an empty BOARD_HEIGHT x BOARD_WIDTH board grid.
 * @returns {Array<Array|null>} 20 rows of 10 nulls each.
 */
export function createBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

/**
 * Check whether `piece` at grid position (x, y) with the given
 * rotation index would overlap locked cells or go out of bounds.
 *
 * @param {Array<Array|null>} board - The current board grid.
 * @param {object} piece - Tetromino definition (shapes array).
 * @param {number} x - Grid column of the piece origin.
 * @param {number} y - Grid row of the piece origin.
 * @param {number} [rotationIndex=0] - Index into piece.shapes.
 * @returns {boolean} True if the placement is invalid (collision).
 */
export function checkCollision(board, piece, x, y, rotationIndex = 0) {
  const shape = piece.shapes[rotationIndex];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;

      const boardX = x + c;
      const boardY = y + r;

      // Left wall, right wall, floor
      if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
        return true;
      }

      // Ceiling (piece spawned above visible area)
      if (boardY < 0) continue;

      // Locked cells
      if (board[boardY][boardX] !== null) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Return true when the piece position is valid (no collision).
 * Convenience wrapper around checkCollision.
 *
 * @param {Array<Array|null>} board
 * @param {object} piece
 * @param {number} x
 * @param {number} y
 * @param {number} [rotationIndex=0]
 * @returns {boolean}
 */
export function isValidPosition(board, piece, x, y, rotationIndex = 0) {
  return !checkCollision(board, piece, x, y, rotationIndex);
}

/**
 * Lock a piece into the board grid at (x, y).
 * Mutates `board` in place: each covered cell becomes
 * `{ name: piece.name, color: piece.color }`.
 *
 * @param {Array<Array|null>} board
 * @param {object} piece
 * @param {number} x
 * @param {number} y
 * @param {number} [rotationIndex=0]
 */
export function lockPiece(board, piece, x, y, rotationIndex = 0) {
  const shape = piece.shapes[rotationIndex];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;

      const boardX = x + c;
      const boardY = y + r;

      if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
        board[boardY][boardX] = { name: piece.name, color: piece.color };
      }
    }
  }
}

/**
 * Clear all completed (full) lines from the board.
 * Rows above cleared lines drop down.
 *
 * @param {Array<Array|null>} board - Mutated in place.
 * @returns {number} Number of lines cleared.
 */
export function clearLines(board) {
  let linesCleared = 0;

  // Walk from bottom to top, collect rows that have no null cells.
  const remaining = [];
  for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== null)) {
      linesCleared++;
    } else {
      remaining.unshift(board[r]);
    }
  }

  // Pad with empty rows at the top.
  const emptyRows = BOARD_HEIGHT - remaining.length;
  for (let i = 0; i < emptyRows; i++) {
    remaining.unshift(Array(BOARD_WIDTH).fill(null));
  }

  // Write back in place.
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    board[r] = remaining[r];
  }

  return linesCleared;
}
