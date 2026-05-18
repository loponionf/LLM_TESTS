export let score = 0;
export let level = 1;
export let lines = 0;
export let paused = false;
export let gameOver = false;
export let nextPiece = null;

export function resetState() {
  score = 0;
  level = 1;
  lines = 0;
  paused = false;
  gameOver = false;
}
