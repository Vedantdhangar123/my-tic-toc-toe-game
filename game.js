/* Pure game logic — no DOM access, so it can be unit-tested in Node. */
(function (root) {
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  function createGame() {
    return { board: Array(9).fill(null), current: 'X', winner: null, line: null, over: false };
  }

  function checkWinner(board) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    return null;
  }

  // Returns true if the move was applied.
  function play(game, index) {
    if (game.over || index < 0 || index > 8 || game.board[index]) return false;
    game.board[index] = game.current;

    const result = checkWinner(game.board);
    if (result) {
      game.winner = result.winner;
      game.line = result.line;
      game.over = true;
    } else if (game.board.every(Boolean)) {
      game.over = true; // draw: winner stays null
    } else {
      game.current = game.current === 'X' ? 'O' : 'X';
    }
    return true;
  }

  const api = { WIN_LINES, createGame, checkWinner, play };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TicTacToe = api;
})(typeof window !== 'undefined' ? window : globalThis);
