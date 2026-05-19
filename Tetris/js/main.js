import { createBoard } from './board.js';
import {
  createInitialState,
  resetGameState,
  togglePause,
  loadBestScore,
  checkBestScore,
  resetBestScore,
} from './gameState.js';
import { renderBoard, renderNextPiece, updateHUD } from './renderer.js';
import { setupInputHandlers } from './input.js';
import {
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotatePiece,
  computeGhostPosition,
  startGravityLoop,
  stopGravityLoop,
} from './gameLoop.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const bestEl = document.getElementById('best-score');
  const nextPieceEl = document.getElementById('next-piece');
  const gameOverEl = document.getElementById('game-over');
  const resetBestBtn = document.getElementById('reset-best-btn');

  // Initialize game state and board
  let state = createInitialState(loadBestScore());
  let board = createBoard();

  /**
   * Re-render everything after a state change.
   */
  function refresh() {
    const ghost = computeGhostPosition(board, state);
    renderBoard(boardEl, board, state.activePiece, ghost);
    renderNextPiece(nextPieceEl, state.nextPiece);
    updateHUD(scoreEl, levelEl, linesEl, bestEl, state);

    // Show game over overlay if applicable
    if (state.gameOver) {
      gameOverEl.style.display = 'block';
      gameOverEl.textContent = 'GAME OVER';
    } else {
      gameOverEl.style.display = 'none';
    }
  }

  /**
   * Re-render after a scoring action (checks and updates best score).
   */
  function refreshAfterScore() {
    checkBestScore(state);
    refresh();
  }

  // Wire input callbacks
  setupInputHandlers({
    moveLeft: () => { if (!state.gameOver && !state.paused) { moveLeft(board, state); refresh(); } },
    moveRight: () => { if (!state.gameOver && !state.paused) { moveRight(board, state); refresh(); } },
    softDrop: () => { if (!state.gameOver && !state.paused) { moveDown(board, state); refreshAfterScore(); } },
    hardDrop: () => { if (!state.gameOver && !state.paused) { hardDrop(board, state); refreshAfterScore(); } },
    rotate: () => { if (!state.gameOver && !state.paused) { rotatePiece(board, state); refresh(); } },
    togglePause: () => {
      const wasPaused = togglePause(state);
      refresh();
      if (wasPaused) {
        stopGravityLoop();
      } else {
        startGravityLoop(board, state, refreshAfterScore);
      }
    },
    restart: () => {
      state = resetGameState(state);
      board = createBoard();
      stopGravityLoop();
      refresh();
      startGravityLoop(board, state, refreshAfterScore);
    },
  });

  // Reset best score button
  resetBestBtn.addEventListener('click', () => {
    resetBestScore(state);
    refresh();
  });

  // Start automatic gravity
  startGravityLoop(board, state, refreshAfterScore);

  // Initial render
  refresh();

  console.log('Tetris V1 initialized');
});
