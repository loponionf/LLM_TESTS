import { createBoard } from './board.js';
import {
  createInitialState,
  resetGameState,
  togglePause,
  loadBestScore,
  checkBestScore,
  resetBestScore,
  performHold,
  resetHold,
  clearReady,
  setReady,
  getNextQueue,
} from './gameState.js';
import { renderBoard, renderNextPiece, renderHoldPiece, renderNextQueue, updateHUD } from './renderer.js';
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
    // Render the next queue (5 upcoming pieces) from the bag randomizer
    const nextQueue = getNextQueue(5);
    renderNextQueue(nextPieceEl, nextQueue);
    updateHUD(scoreEl, levelEl, linesEl, bestEl, state);

    // Show game over overlay if applicable
    if (state.gameOver) {
      gameOverEl.style.display = 'block';
      gameOverEl.innerHTML = '<h2>GAME OVER</h2><div class="final-score">Score: ' + state.score + '</div><button id="game-over-restart-btn">RESTART</button>';
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

  /**
   * Start gameplay: clear ready flag, hide overlays, begin gravity.
   */
  function startGame() {
    if (!state.ready) return;
    clearReady(state);
    startOverlayEl.style.display = 'none';
    pauseOverlayEl.style.display = 'none';
    gameOverEl.style.display = 'none';
    startGravityLoop(board, state, refreshAfterScore);
  }

  // Wire input callbacks
  setupInputHandlers({
    moveLeft: () => { if (!state.gameOver && !state.paused && !state.ready) { moveLeft(board, state); refresh(); } },
    moveRight: () => { if (!state.gameOver && !state.paused && !state.ready) { moveRight(board, state); refresh(); } },
    softDrop: () => { if (!state.gameOver && !state.paused && !state.ready) { moveDown(board, state); refreshAfterScore(); } },
    hardDrop: () => { if (!state.gameOver && !state.paused && !state.ready) { hardDrop(board, state); refreshAfterScore(); } },
    rotate: () => { if (!state.gameOver && !state.paused && !state.ready) { rotatePiece(board, state); refresh(); } },
    togglePause: () => {
      // No-op when ready (game hasn't started yet) or game over
      if (state.ready || state.gameOver) return;
      const wasPaused = togglePause(state);
      refresh();
      if (wasPaused) {
        stopGravityLoop();
        pauseOverlayEl.style.display = 'block';
      } else {
        pauseOverlayEl.style.display = 'none';
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
      stopGravityLoop();
      state = resetGameState(state);
      lastScoreForBestCheck = state.score;
      board = createBoard();
      gameOverEl.style.display = 'none';
      pauseOverlayEl.style.display = 'none';
      startOverlayEl.style.display = 'block';
      refresh();
    },
  });

  // Start button
  startBtn.addEventListener('click', () => {
    startGame();
  });

  // Enter key starts game from ready state
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.ready) {
      e.preventDefault();
      startGame();
    }
  });

  // Game-over restart button
  document.addEventListener('click', (e) => {
    if (e.target.id === 'game-over-restart-btn') {
      stopGravityLoop();
      state = resetGameState(state);
      lastScoreForBestCheck = state.score;
      board = createBoard();
      gameOverEl.style.display = 'none';
      pauseOverlayEl.style.display = 'none';
      startOverlayEl.style.display = 'block';
      refresh();
    }
  });

  // Reset best score button
  resetBestBtn.addEventListener('click', () => {
    resetBestScore(state);
    lastScoreForBestCheck = state.score;
    refresh();
  });

  // Initial render — do NOT start gravity until Start
  refresh();

  console.log('Tetris V1 initialized');
});
