// Tetromino shape matrices (each rotation state is a 2D array of 0/1)
// and a default color.

const TETROMINOES = {
  I: {
    name: 'I',
    color: '#00f0f0',
    shapes: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
  },
  O: {
    name: 'O',
    color: '#f0f000',
    shapes: [
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  T: {
    name: 'T',
    color: '#a000f0',
    shapes: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  S: {
    name: 'S',
    color: '#00f000',
    shapes: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  Z: {
    name: 'Z',
    color: '#f00000',
    shapes: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
    ],
  },
  J: {
    name: 'J',
    color: '#0000f0',
    shapes: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
  },
  L: {
    name: 'L',
    color: '#f0a000',
    shapes: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
};

/**
 * Return the tetromino definition by name.
 * @param {string} name - One of 'I', 'O', 'T', 'S', 'Z', 'J', 'L'.
 * @returns {object|null} Tetromino definition or null if not found.
 */
export function getTetromino(name) {
  return TETROMINOES[name] || null;
}

/**
 * 7-bag randomizer: ensures all 7 tetrominoes appear once per bag
 * before a new shuffled bag begins.
 */
export class BagRandomizer {
  constructor() {
    this._bag = [];
    this._queue = []; // upcoming pieces in FIFO order
  }

  /**
   * Ensure the queue has at least `count` upcoming pieces.
   * Refills and reshuffles the bag as needed, moving one piece
   * at a time from _bag into _queue.
   * @param {number} count
   */
  _ensureQueue(count) {
    while (this._queue.length < count) {
      if (this._bag.length === 0) {
        this._refill();
      }
      this._queue.push(this._bag.pop());
    }
  }

  /**
   * Return the next tetromino name from the 7-bag system.
   * Consumes the first item from the upcoming queue.
   * @returns {string} Tetromino name.
   */
  next() {
    this._ensureQueue(1);
    return this._queue.shift();
  }

  /**
   * Return the next N upcoming tetromino names without consuming them.
   * @param {number} count - How many upcoming pieces to peek at.
   * @returns {string[]} Array of tetromino names.
   */
  peek(count = 1) {
    this._ensureQueue(count);
    return this._queue.slice(0, count);
  }

  /**
   * Reset the randomizer to a fresh state.
   */
  reset() {
    this._bag = [];
    this._queue = [];
  }

  _refill() {
    const keys = Object.keys(TETROMINOES);
    // Fisher-Yates shuffle
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    this._bag = keys.slice();
  }
}

// Singleton instance shared across modules
export const randomizer = new BagRandomizer();

/**
 * Return the next tetromino definition from the 7-bag randomizer.
 * @returns {object} Tetromino definition.
 */
export function getRandomTetromino() {
  const name = randomizer.next();
  return TETROMINOES[name];
}

// Export the full list of names for iteration
export const TETROMINO_NAMES = Object.keys(TETROMINOES);
