import { BOARD_HEIGHT, BOARD_WIDTH } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const nextPieceEl = document.getElementById('next-piece');
  const pauseBtn = document.getElementById('pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const gameOverEl = document.getElementById('game-over');

  boardEl.width = BOARD_WIDTH * 30;
  boardEl.height = BOARD_HEIGHT * 30;

  console.log('Tetris V1 shell loaded');
});
