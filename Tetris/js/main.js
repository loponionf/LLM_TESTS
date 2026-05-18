import { createBoard } from './board.js';
import { createInitialState } from './gameState.js';
import { renderBoard, renderNextPiece, updateHUD } from './renderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const nextPieceEl = document.getElementById('next-piece');

  // Initialize game state and board
  const state = createInitialState();
  const board = createBoard();

  // Render initial state
  renderBoard(boardEl, board);
  renderNextPiece(nextPieceEl, state.nextPiece);
  updateHUD(scoreEl, levelEl, linesEl, state);

  console.log('Tetris V1 initialized');
});
