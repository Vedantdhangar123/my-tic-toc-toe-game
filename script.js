/* UI layer: renders the board and wires up events. */
(function () {
  const { createGame, play } = window.TicTacToe;

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const resetScoresBtn = document.getElementById('reset-scores');
  const scoreEls = {
    X: document.getElementById('wins-x'),
    O: document.getElementById('wins-o'),
    D: document.getElementById('wins-d')
  };

  let game = createGame();
  const scores = { X: 0, O: 0, D: 0 };
  let firstPlayer = 'X';

  // Build the 9 cells once.
  const cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.dataset.index = i;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, empty`);
    cell.addEventListener('click', () => handleMove(i));
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  function handleMove(index) {
    if (!play(game, index)) return;

    if (game.over) {
      if (game.winner) scores[game.winner]++;
      else scores.D++;
    }
    render();
  }

  function render() {
    game.board.forEach((mark, i) => {
      const cell = cells[i];
      cell.textContent = mark || '';
      cell.className = 'cell' + (mark ? ` taken ${mark.toLowerCase()}` : '');
      cell.disabled = game.over || !!mark;
      const pos = `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}`;
      cell.setAttribute('aria-label', `${pos}, ${mark || 'empty'}`);
    });

    if (game.line) game.line.forEach(i => cells[i].classList.add('win'));

    boardEl.classList.toggle('over', game.over);
    document.querySelectorAll('.score').forEach(el => el.classList.remove('active'));

    if (game.winner) {
      statusEl.textContent = `🎉 Player ${game.winner} wins!`;
      statusEl.className = `status result ${game.winner.toLowerCase()}`;
    } else if (game.over) {
      statusEl.textContent = "🤝 It's a draw!";
      statusEl.className = 'status result draw';
    } else {
      statusEl.textContent = `Player ${game.current}'s turn`;
      statusEl.className = `status ${game.current.toLowerCase()}`;
      document.getElementById(`score-${game.current.toLowerCase()}`).classList.add('active');
    }

    scoreEls.X.textContent = scores.X;
    scoreEls.O.textContent = scores.O;
    scoreEls.D.textContent = scores.D;
  }

  resetBtn.addEventListener('click', () => {
    firstPlayer = firstPlayer === 'X' ? 'O' : 'X'; // alternate who starts
    game = createGame();
    game.current = firstPlayer;
    render();
  });

  resetScoresBtn.addEventListener('click', () => {
    scores.X = scores.O = scores.D = 0;
    firstPlayer = 'X';
    game = createGame();
    render();
  });

  render();
})();
