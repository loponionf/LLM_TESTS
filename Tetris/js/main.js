import { createBoard } from './board.js';
import {
  createInitialState,
  resetGameState,
  togglePause,
  startGame,
  loadBestScore,
  checkBestScore,
  resetBestScore,
  performHold,
  resetHold,
} from './gameState.js';
import { renderBoard, renderNextPiece, renderHoldPiece, updateHUD } from './renderer.js';
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
  const holdPieceEl = document.getElementById('hold-piece');
  const nextPieceEl = document.getElementById('next-piece');
  const gameOverEl = document.getElementById('game-over');
  const startOverlayEl = document.getElementById('start-overlay');
  const pauseOverlayEl = document.getElementById('pause-overlay');
  const startBtn = document.getElementById('start-btn');
  const resetBestBtn = document.getElementById('reset-best-btn');

  // Initialize game state and board
  let state = createInitialState(loadBestScore());
  let board = createBoard();
  let lastScoreForBestCheck = state.score;

  /**
   * Re-render everything after a state change.
   */
  function refresh() {
    const ghost = computeGhostPosition(board, state);
    renderBoard(boardEl, board, state.activePiece, ghost);
    renderHoldPiece(holdPieceEl, state.heldPiece);
    renderNextPiece(nextPieceEl, state.nextPiece);
    updateHUD(scoreEl, levelEl, linesEl, bestEl, state);

    // Start overlay: visible when ready
    if (state.ready) {
      startOverlayEl.style.display = 'block';
    } else {
      startOverlayEl.style.display = 'none';
    }

    // Pause overlay
    if (state.paused) {
      pauseOverlayEl.style.display = 'block';
    } else {
      pauseOverlayEl.style.display = 'none';
    }

    // Game over overlay
    if (state.gameOver) {
      gameOverEl.style.display = 'block';
      gameOverEl.innerHTML = `GAME OVER<span class="final-score">Score: ${state.score}</span>`;
    } else {
      gameOverEl.style.display = 'none';
    }
  }

  /**
   * Re-render after a scoring action (checks and updates best score).
   * Only calls checkBestScore when the current score has actually changed
   * since the last check, to avoid overwriting a freshly reset best score.
   */
  function refreshAfterScore() {
    if (state.score !== lastScoreForBestCheck) {
      checkBestScore(state);
      lastScoreForBestCheck = state.score;
    }
    refresh();
  }

  // Wire input callbacks
  setupInputHandlers({
    moveLeft: () => { if (!state.gameOver && !state.paused && !state.ready) { moveLeft(board, state); refresh(); } },
    moveRight: () => { if (!state.gameOver && !state.paused && !state.ready) { moveRight(board, state); refresh(); } },
    softDrop: () => { if (!state.gameOver && !state.paused && !state.ready) { moveDown(board, state); refreshAfterScore(); } },
    hardDrop: () => { if (!state.gameOver && !state.paused && !state.ready) { hardDrop(board, state); refreshAfterScore(); } },
    rotate: () => { if (!state.gameOver && !state.paused && !state.ready) { rotatePiece(board, state); refresh(); } },
    togglePause: () => {
      const wasPaused = togglePause(state);
      refresh();
      if (wasPaused) {
        stopGravityLoop();
      } else {
        startGravityLoop(board, state, refreshAfterScore);
      }
    },
    hold: () => {
      if (!state.gameOver && !state.paused && !state.ready) {
        performHold(state);
        refresh();
      }
    },
    restart: () => {
      state = resetGameState(state);
      lastScoreForBestCheck = state.score;
      board = createBoard();
      stopGravityLoop();
      refresh();
      startGravityLoop(board, state, refreshAfterScore);
    },
  });

  // Start button
  startBtn.addEventListener('click', () => {
    startGame(state);
    refresh();
    startGravityLoop(board, state, refreshAfterScore);
  });

  // Enter key: start if ready, otherwise no-op (pause/restart have their own handlers)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.ready) {
      e.preventDefault();
      startGame(state);
      refresh();
      startGravityLoop(board, state, refreshAfterScore);
    }
  });

  // Reset best score button
  resetBestBtn.addEventListener('click', () => {
    resetBestScore(state);
    lastScoreForBestCheck = state.score;
    refresh();
  });

  // Do NOT start gravity until the user presses Start
  // startGravityLoop(board, state, refreshAfterScore);

  // Initial render (shows start overlay)
  refresh();

  console.log('Tetris V1 initialized');
});
