import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_DOWN,
  KEY_UP,
  KEY_SPACE,
} from './constants.js';

/**
 * Set up keyboard and button input handlers.
 *
 * Each key press invokes the corresponding callback from `callbacks`.
 * Button clicks invoke their named callbacks.
 *
 * Space key prevents page scroll.
 *
 * Safe to call multiple times — only attaches one listener per key/button.
 *
 * @param {object} callbacks
 * @param {Function} [callbacks.moveLeft]
 * @param {Function} [callbacks.moveRight]
 * @param {Function} [callbacks.softDrop]
 * @param {Function} [callbacks.rotate]
 * @param {Function} [callbacks.hardDrop]
 * @param {Function} [callbacks.togglePause]
 * @param {Function} [callbacks.restart]
 */
export function setupInputHandlers(callbacks) {
  const safe = (fn) => (typeof fn === 'function' ? fn : () => {});

  const keyMap = {
    [KEY_LEFT]: safe(callbacks.moveLeft),
    [KEY_RIGHT]: safe(callbacks.moveRight),
    [KEY_DOWN]: safe(callbacks.softDrop),
    [KEY_UP]: safe(callbacks.rotate),
    [KEY_SPACE]: safe(callbacks.hardDrop),
  };

  const handleKey = (e) => {
    if (e.key in keyMap) {
      e.preventDefault();
      keyMap[e.key]();
    }
  };

  document.addEventListener('keydown', handleKey);

  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', safe(callbacks.togglePause));
  }

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', safe(callbacks.restart));
  }
}
