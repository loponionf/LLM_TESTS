import { createBoard } from './board.js';
import { createInitialState, resetGameState } from './gameState.js';
import { renderBoard, renderNextPiece, updateHUD } from './renderer.js';
import { setupInputHandlers } from './input.js';
import { moveLeft, moveRight, moveDown, hardDrop, rotatePiece } from './gameLoop.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const nextPieceEl = document.getElementById('next-piece');
  const gameOverEl = document.getElementById('game-over');

  // Initialize game state and board
  let state = createInitialState();
  let board = createBoard();

  /**
   * Re-render everything after a state change.
   */
  function refresh() {
    renderBoard(boardEl, board, state.activePiece);
    renderNextPiece(nextPieceEl, state.nextPiece);
    updateHUD(scoreEl, levelEl, linesEl, state);

    // Show game over overlay if applicable
    if (state.gameOver) {
      gameOverEl.style.display = 'block';
      gameOverEl.textContent = 'GAME OVER';
    } else {
      gameOverEl.style.display = 'none';
    }
  }

  /**
   * Full restart: reset state and board.
   */
  function restart() {
    state = resetGameState();
    board = createBoard();
    refresh();
  }

  // Wire input callbacks
  setupInputHandlers({
    moveLeft: () => { if (!state.gameOver) { moveLeft(board, state); refresh(); } },
    moveRight: () => { if (!state.gameOver) { moveRight(board, state); refresh(); } },
    softDrop: () => { if (!state.gameOver) { moveDown(board, state); refresh(); } },
    hardDrop: () => { if (!state.gameOver) { hardDrop(board, state); refresh(); } },
    rotate: () => { if (!state.gameOver) { rotatePiece(board, state); refresh(); } },
    restart,
  });

  // Initial render
  refresh();

  console.log('Tetris V1 initialized');
});
