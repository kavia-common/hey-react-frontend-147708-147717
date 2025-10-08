import React, { useMemo, useState } from 'react';
import Board from './Board';

/**
 * calculateWinner
 * Determines the winner and returns { winner: 'X'|'O'|null, line: number[]|null }
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * PUBLIC_INTERFACE
 * Game
 * Top-level Tic Tac Toe game component with state management and controls.
 */
export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isBoardFull = useMemo(() => squares.every(Boolean), [squares]);
  const isDraw = !winner && isBoardFull;

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? `It's a draw`
      : `Turn: ${xIsNext ? 'X' : 'O'}`;

  function handleSquareClick(index) {
    // Ignore clicks if there's a winner or the cell is filled
    if (winner || squares[index]) return;

    setSquares(prev => {
      const next = prev.slice();
      next[index] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext(prev => !prev);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <section className="container-card" aria-label="Tic Tac Toe Game">
      <div className="header">
        <span className="badge">Ocean Professional</span>
        <h1>Tic Tac Toe</h1>
      </div>
      <p className="subtle">
        A simple, modern game with clean UI. Use your mouse or keyboard to play.
      </p>

      <div className="game-wrapper" style={{ marginTop: 12 }}>
        <div>
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={line}
            disabled={Boolean(winner)}
          />
        </div>

        <aside className="status-card" aria-live="polite">
          <div className="status-line" style={{ marginBottom: 8 }}>
            <span className={`status-dot ${winner ? '' : isDraw ? 'warn' : ''} ${winner ? '' : ''} ${!winner && !isDraw ? '' : ''} ${winner ? '' : ''}`}></span>
            <strong>{statusText}</strong>
          </div>

          <div className="status-line">
            <span className="legend">
              <span className="x">X</span> vs <span className="o">O</span>
            </span>
          </div>

          <hr className="hr" />

          <div className="status-line">
            <button
              className="btn"
              onClick={resetGame}
              aria-label="Start a new game"
            >
              New Game
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                // Small helper: if game is finished, also reset; else just toggle turn hint
                setXIsNext(prev => !prev);
              }}
              aria-label="Toggle current player"
              title="Toggle current player (for demo)"
            >
              Toggle Turn
            </button>
            {winner && (
              <span className="subtle" style={{ marginLeft: 8 }}>
                Line: {line?.join(', ')}
              </span>
            )}
            {isDraw && (
              <span className="subtle" style={{ marginLeft: 8 }}>
                No moves left
              </span>
            )}
          </div>

          <p className="subtle" style={{ marginTop: 10 }}>
            Tips: Use Tab to focus squares, press Enter or Space to play.
          </p>
        </aside>
      </div>
    </section>
  );
}
