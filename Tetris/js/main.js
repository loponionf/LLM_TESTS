import { createBoard } from './board.js';
import { createInitialState } from './gameState.js';
import { renderBoard, renderNextPiece, updateHUD } from './renderer.js';
import { setupInputHandlers } from './input.js';
import { moveLeft, moveRight, moveDown, hardDrop, rotatePiece } from './gameLoop.js';
document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const nextPieceEl = document.getElementById('next-piece');

  // Initialize game state and board
  const state = createInitialState();
  const board = createBoard();

  /**
   * Re-render everything after a state change.
   */
  function refresh() {
    renderBoard(boardEl, board, state.activePiece);
    renderNextPiece(nextPieceEl, state.nextPiece);
    updateHUD(scoreEl, levelEl, linesEl, state);
  }

  // Wire input callbacks
  setupInputHandlers({
    moveLeft: () => { moveLeft(board, state); refresh(); },
    moveRight: () => { moveRight(board, state); refresh(); },
    softDrop: () => { moveDown(board, state); refresh(); },
    hardDrop: () => { hardDrop(board, state); refresh(); },
    rotate: () => { rotatePiece(board, state); refresh(); },
  });

  // Initial render
  refresh();

  console.log('Tetris V1 initialized');
});
