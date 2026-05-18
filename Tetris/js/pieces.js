export const TETROMINOES = {};

export function getTetromino(name) {
  return TETROMINOES[name] || null;
}
