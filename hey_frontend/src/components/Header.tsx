import React from 'react';
import { useNotes } from '../state/NotesContext';

// PUBLIC_INTERFACE
export function Header() {
  /** App header: brand, search field, and New Note button. */
  const { state, dispatch } = useNotes();

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Hey Note Taker">
          <div className="brand-badge" aria-hidden="true">✦</div>
          <span>Hey Notes</span>
        </div>
        <label className="search" aria-label="Search notes">
          <span aria-hidden="true">🔎</span>
          <input
            aria-label="Search"
            placeholder="Search notes or #tags"
            value={state.search}
            onChange={(e) => dispatch({ type: 'setSearch', value: e.target.value })}
          />
        </label>
        <button
          className="button"
          onClick={() => dispatch({ type: 'add' })}
          aria-label="Create new note"
        >
          New Note
        </button>
      </div>
    </header>
  );
}
