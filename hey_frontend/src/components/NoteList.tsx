import React from 'react';
import { useFilteredNotes } from '../hooks/useFilteredNotes';
import { useNotes } from '../state/NotesContext';
import { formatDate } from '../utils/helpers';

// PUBLIC_INTERFACE
export function NoteList() {
  /** List of notes with pin toggle and selection. */
  const { state, dispatch } = useNotes();
  const notes = useFilteredNotes(state.notes, state.search, state.tagFilter, state.sort);

  return (
    <aside className="panel list" aria-label="Notes list">
      {notes.length === 0 ? (
        <div style={{ padding: 16, color: '#6b7280' }}>No notes yet. Create one!</div>
      ) : (
        notes.map((n) => (
          <article
            key={n.id}
            className="note-item"
            role="button"
            tabIndex={0}
            aria-pressed={state.selectedId === n.id}
            onClick={() => dispatch({ type: 'select', id: n.id })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') dispatch({ type: 'select', id: n.id });
            }}
          >
            <div>
              <div className="note-title">{n.title || 'Untitled'}</div>
              <div className="note-meta">
                {n.pinned ? '📌 Pinned • ' : ''}
                Updated {formatDate(n.updatedAt)}
              </div>
              <div className="tags" aria-label="Tags">
                {(n.tags || []).map((t) => (
                  <button
                    key={t}
                    className="tag"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'setTagFilter', value: t });
                    }}
                    aria-label={`Filter by tag ${t}`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <button
                className="pin"
                title={n.pinned ? 'Unpin' : 'Pin'}
                aria-label={n.pinned ? 'Unpin note' : 'Pin note'}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'togglePin', id: n.id });
                }}
              >
                {n.pinned ? '📌' : '📍'}
              </button>
            </div>
          </article>
        ))
      )}
    </aside>
  );
}
