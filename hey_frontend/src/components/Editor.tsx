import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNotes } from '../state/NotesContext';
import { normalizeTag } from '../utils/helpers';

// PUBLIC_INTERFACE
export function Editor() {
  /** Editor for selected note with title, body, tag management, and actions. */
  const { state, dispatch } = useNotes();
  const note = useMemo(() => state.notes.find((n) => n.id === state.selectedId) || null, [state]);
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const [tagInput, setTagInput] = useState('');

  // Keep local fields in sync when selection changes
  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');
    setTagInput('');
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(() => {
    if (!note) return;
    dispatch({ type: 'update', id: note.id, changes: { title, body } });
  }, [dispatch, note, title, body]);

  // Keyboard shortcut Ctrl/Cmd+S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  if (!note) {
    return (
      <section className="panel editor" aria-label="Editor">
        <div style={{ padding: 16, color: '#6b7280' }}>Select a note to start editing.</div>
      </section>
    );
  }

  const allTags = Array.from(new Set(state.notes.flatMap((n) => n.tags || []))).sort();

  return (
    <section className="panel editor" aria-label="Editor">
      <div className="toolbar">
        <div className="left">
          <select
            aria-label="Sort notes"
            value={state.sort}
            onChange={(e) => dispatch({ type: 'setSort', value: e.target.value as any })}
          >
            <option value="updated">Sort by Updated</option>
            <option value="title">Sort by Title</option>
          </select>
          {state.tagFilter && (
            <button
              className="button ghost"
              onClick={() => dispatch({ type: 'setTagFilter', value: null })}
              aria-label="Clear tag filter"
            >
              Clear tag: #{state.tagFilter}
            </button>
          )}
        </div>
        <div className="right">
          <span className="kbd" aria-hidden="true">⌘/Ctrl+S</span>
          <button className="button secondary" onClick={save} aria-label="Save note">
            Save
          </button>
          <button
            className="button"
            onClick={() => dispatch({ type: 'delete', id: note.id })}
            aria-label="Delete note"
          >
            Delete
          </button>
        </div>
      </div>

      <input
        className="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Title"
      />
      <textarea
        className="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your note..."
        aria-label="Body"
      />

      <div className="toolbar">
        <div className="left">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag and press Enter"
            aria-label="Add tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const t = normalizeTag(tagInput);
                if (t) dispatch({ type: 'addTag', id: note.id, tag: t });
                setTagInput('');
              }
            }}
          />
          <div className="tags" aria-label="Tags">
            {(note.tags || []).map((t) => (
              <span key={t} className="tag">
                #{t}{' '}
                <button
                  className="pin"
                  aria-label={`Remove tag ${t}`}
                  onClick={() => dispatch({ type: 'removeTag', id: note.id, tag: t })}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="right">
          <select
            aria-label="Filter by tag"
            value={state.tagFilter ?? ''}
            onChange={(e) =>
              dispatch({ type: 'setTagFilter', value: e.target.value || null })
            }
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
