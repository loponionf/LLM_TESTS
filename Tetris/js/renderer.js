import { CELL_SIZE } from './constants.js';

/**
 * Draw a single filled cell on the given 2D context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - grid column
 * @param {number} y - grid row
 * @param {string} color
 */
function fillCell(ctx, x, y, color) {
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  ctx.fillStyle = color;
  ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
}

/**
 * Render the board grid and any locked cells onto the board canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {Array<Array|null>} board - 2D grid of null | { name, color }
 */
export function renderBoard(canvas, board) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background grid
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw locked cells
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c]) {
        fillCell(ctx, c, r, board[r][c].color);
      }
    }
  }
}

/**
 * Render the next piece preview onto its canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {object|null} piece - { name, color, shape, x, y } or null
 */
export function renderNextPiece(canvas, piece) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!piece) return;

  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0].length;

  // Center the piece in the preview canvas
  const offsetX = Math.floor((canvas.width / CELL_SIZE - cols) / 2);
  const offsetY = Math.floor((canvas.height / CELL_SIZE - rows) / 2);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c]) {
        fillCell(ctx, offsetX + c, offsetY + r, piece.color);
      }
    }
  }
}

/**
 * Update the HUD text elements with current score, level, and lines.
 * @param {HTMLElement} scoreEl
 * @param {HTMLElement} levelEl
 * @param {HTMLElement} linesEl
 * @param {object} state - game state object
 */
export function updateHUD(scoreEl, levelEl, linesEl, state) {
  scoreEl.textContent = state.score;
  levelEl.textContent = state.level;
  linesEl.textContent = state.lines;
}
