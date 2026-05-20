import { CELL_SIZE } from './constants.js';
import { getTetromino } from './pieces.js';

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
  const inset = 1;

  // Base fill
  ctx.fillStyle = color;
  ctx.fillRect(px + inset, py + inset, CELL_SIZE - inset * 2, CELL_SIZE - inset * 2);

  // Top-left highlight
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(px + inset, py + inset, CELL_SIZE - inset * 2, 2);
  ctx.fillRect(px + inset, py + inset, 2, CELL_SIZE - inset * 2);

  // Bottom-right shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(px + inset, py + CELL_SIZE - inset - 2, CELL_SIZE - inset * 2, 2);
  ctx.fillRect(px + CELL_SIZE - inset - 2, py + inset, 2, CELL_SIZE - inset * 2);

  // Subtle border
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.strokeRect(px + inset, py + inset, CELL_SIZE - inset * 2, CELL_SIZE - inset * 2);
}

/**
 * Draw a ghost cell — translucent outline only.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - grid column
 * @param {number} y - grid row
 * @param {string} color
 */
function fillGhostCell(ctx, x, y, color) {
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  const inset = 1;

  // Translucent fill
  ctx.fillStyle = color + '22';
  ctx.fillRect(px + inset, py + inset, CELL_SIZE - inset * 2, CELL_SIZE - inset * 2);

  // Outline border
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px + inset + 1, py + inset + 1, CELL_SIZE - inset * 2 - 2, CELL_SIZE - inset * 2 - 2);
}

/**
 * Render the board grid and any locked cells onto the board canvas.
 * Optionally draws a ghost piece and an active piece on top.
 * @param {HTMLCanvasElement} canvas
 * @param {Array<Array|null>} board - 2D grid of null | { name, color }
 * @param {object|null} [activePiece] - { name, color, shape, x, y } or null
 * @param {{x: number, y: number}|null} [ghostPosition] - Ghost landing position or null
 */
export function renderBoard(canvas, board, activePiece, ghostPosition) {
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

  // Draw ghost piece below active piece
  if (activePiece && ghostPosition) {
    const shape = activePiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          fillGhostCell(ctx, ghostPosition.x + c, ghostPosition.y + r, activePiece.color);
        }
      }
    }
  }

  // Draw active piece on top
  if (activePiece) {
    const shape = activePiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          fillCell(ctx, activePiece.x + c, activePiece.y + r, activePiece.color);
        }
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
 * Update the HUD text elements with current score, level, lines, and best score.
 * @param {HTMLElement} scoreEl
 * @param {HTMLElement} levelEl
 * @param {HTMLElement} linesEl
 * @param {HTMLElement} bestEl
 * @param {object} state - game state object
 */
export function renderHoldPiece(canvas, piece) {
  renderNextPiece(canvas, piece);
}

/**
 * Render multiple upcoming pieces stacked vertically on the next-piece canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {string[]} pieceNames - Array of tetromino names (e.g. ['T', 'I', 'S']).
 */
export function renderNextQueue(canvas, pieceNames) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!pieceNames || pieceNames.length === 0) return;

  // Use a smaller cell size for the queue preview
  const qCellSize = 14;

  for (let i = 0; i < pieceNames.length; i++) {
    const tet = getTetromino(pieceNames[i]);
    if (!tet) continue;

    const shape = tet.shapes[0];
    const rows = shape.length;
    const cols = shape[0].length;

    // Center horizontally, stack vertically with spacing
    const offsetX = Math.floor((canvas.width / qCellSize - cols) / 2);
    const offsetY = i * (rows + 1) + Math.floor((canvas.height / qCellSize - (pieceNames.length * (rows + 1))) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!shape[r][c]) continue;
        const px = (offsetX + c) * qCellSize;
        const py = (offsetY + r) * qCellSize;
        const inset = 1;

        ctx.fillStyle = tet.color;
        ctx.fillRect(px + inset, py + inset, qCellSize - inset * 2, qCellSize - inset * 2);

        // Top-left highlight
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(px + inset, py + inset, qCellSize - inset * 2, 2);
        ctx.fillRect(px + inset, py + inset, 2, qCellSize - inset * 2);

        // Bottom-right shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(px + inset, py + qCellSize - inset - 2, qCellSize - inset * 2, 2);
        ctx.fillRect(px + qCellSize - inset - 2, py + inset, 2, qCellSize - inset * 2);
      }
    }
  }
}

export function updateHUD(scoreEl, levelEl, linesEl, bestEl, state) {
  scoreEl.textContent = state.score;
  levelEl.textContent = state.level;
  linesEl.textContent = state.lines;
  bestEl.textContent = state.bestScore;
}
