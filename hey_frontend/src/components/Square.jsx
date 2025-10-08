import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Square
 * A single Tic Tac Toe cell. Renders a button to ensure keyboard accessibility.
 */
export default function Square({ value, onClick, isWinning, index, disabled }) {
  const labelMap = {
    X: 'X',
    O: 'O',
    null: 'Empty'
  };
  const classes = [
    'square',
    value === 'X' ? 'x' : '',
    value === 'O' ? 'o' : '',
    isWinning ? 'winning' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={`Square ${index + 1}: ${labelMap[value ?? 'null']}`}
      disabled={disabled}
    >
      {value}
    </button>
  );
}
