const test = require('node:test');
const assert = require('node:assert');
const { createGame, play, checkWinner, WIN_LINES } = require('./game.js');

test('X moves first and players alternate', () => {
  const g = createGame();
  assert.strictEqual(g.current, 'X');
  play(g, 0);
  assert.strictEqual(g.board[0], 'X');
  assert.strictEqual(g.current, 'O');
});

test('cannot play on an occupied square', () => {
  const g = createGame();
  play(g, 4);
  assert.strictEqual(play(g, 4), false);
  assert.strictEqual(g.board[4], 'X');
  assert.strictEqual(g.current, 'O');
});

test('every winning line is detected for both players', () => {
  for (const mark of ['X', 'O']) {
    for (const line of WIN_LINES) {
      const board = Array(9).fill(null);
      line.forEach(i => (board[i] = mark));
      const r = checkWinner(board);
      assert.deepStrictEqual(r, { winner: mark, line });
    }
  }
});

test('X wins with top row; game locks afterwards', () => {
  const g = createGame();
  [0, 3, 1, 4, 2].forEach(i => play(g, i)); // X:0,1,2  O:3,4
  assert.strictEqual(g.winner, 'X');
  assert.strictEqual(g.over, true);
  assert.deepStrictEqual(g.line, [0, 1, 2]);
  assert.strictEqual(play(g, 8), false);
});

test('O can win (loss for X)', () => {
  const g = createGame();
  [0, 3, 1, 4, 8, 5].forEach(i => play(g, i)); // O:3,4,5
  assert.strictEqual(g.winner, 'O');
  assert.deepStrictEqual(g.line, [3, 4, 5]);
});

test('draw is detected when board fills with no winner', () => {
  const g = createGame();
  // X O X / X O O / O X X
  [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach(i => play(g, i));
  assert.strictEqual(g.winner, null);
  assert.strictEqual(g.over, true);
  assert.ok(g.board.every(Boolean));
});

test('win on the last move counts as a win, not a draw', () => {
  const g = createGame();
  // X O X / O X O / O X X  -> X completes 0-4-8 diagonal on final move
  [0, 1, 2, 3, 4, 5, 7, 6, 8].forEach(i => play(g, i));
  assert.strictEqual(g.winner, 'X');
});

test('out-of-range moves are rejected', () => {
  const g = createGame();
  assert.strictEqual(play(g, -1), false);
  assert.strictEqual(play(g, 9), false);
});
