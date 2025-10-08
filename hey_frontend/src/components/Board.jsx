import React from 'react';
import Square from './Square';

/**
 * PUBLIC_INTERFACE
 * Board
 * Renders a 3x3 grid of Square components.
 */
export default function Board({ squares, onSquareClick, winningLine, disabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => {
        const isWinning = Array.isArray(winningLine) && winningLine.includes(idx);
        return (
          <Square
            key={idx}
            index={idx}
            value={val}
            isWinning={isWinning}
            onClick={() => onSquareClick(idx)}
            disabled={disabled || Boolean(val)}
          />
        );
      })}
    </div>
  );
}
