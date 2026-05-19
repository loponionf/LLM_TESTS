import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_DOWN,
  KEY_UP,
  KEY_SPACE,
  KEY_HOLD,
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
 * Re-calling with new callbacks updates the behavior for future events.
 *
 * @param {object} [callbacks]
 * @param {Function} [callbacks.moveLeft]
 * @param {Function} [callbacks.moveRight]
 * @param {Function} [callbacks.softDrop]
 * @param {Function} [callbacks.rotate]
 * @param {Function} [callbacks.hardDrop]
 * @param {Function} [callbacks.togglePause]
 * @param {Function} [callbacks.restart]
 * @param {Function} [callbacks.hold]
 */
let currentCallbacks = {};
let keyListenerAttached = false;
let pauseListenerAttached = false;
let restartListenerAttached = false;

/**
 * Safely invoke a callback if it is a function.
 *
 * @param {unknown} fn
 * @returns {() => void}
 */
const safe = (fn) => (typeof fn === 'function' ? fn : () => {});

export function setupInputHandlers(callbacks) {
  currentCallbacks = callbacks || {};

  if (!keyListenerAttached) {
    const KEY_MAP = {
      [KEY_LEFT]: 'moveLeft',
      [KEY_RIGHT]: 'moveRight',
      [KEY_DOWN]: 'softDrop',
      [KEY_UP]: 'rotate',
      [KEY_SPACE]: 'hardDrop',
      [KEY_HOLD]: 'hold',
    };

    const handleKey = (e) => {
      const cbName = KEY_MAP[e.key];
      if (cbName) {
        e.preventDefault();
        safe(currentCallbacks[cbName])();
      }
    };

    document.addEventListener('keydown', handleKey);
    keyListenerAttached = true;
  }

  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn && !pauseListenerAttached) {
    document.addEventListener('click', (e) => {
      if (e.target === pauseBtn) {
        safe(currentCallbacks.togglePause)();
      }
    });
    pauseListenerAttached = true;
  }

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn && !restartListenerAttached) {
    document.addEventListener('click', (e) => {
      if (e.target === restartBtn) {
        safe(currentCallbacks.restart)();
      }
    });
    restartListenerAttached = true;
  }
}
