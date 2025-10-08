import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { Note, SortMode } from '../utils/types';
import { STORAGE_KEY, uid, normalizeTag } from '../utils/helpers';

type State = {
  notes: Note[];
  selectedId: string | null;
  search: string;
  tagFilter: string | null;
  sort: SortMode;
};

type Action =
  | { type: 'add'; payload?: Partial<Note> }
  | { type: 'update'; id: string; changes: Partial<Note> }
  | { type: 'delete'; id: string }
  | { type: 'select'; id: string | null }
  | { type: 'togglePin'; id: string }
  | { type: 'addTag'; id: string; tag: string }
  | { type: 'removeTag'; id: string; tag: string }
  | { type: 'setSearch'; value: string }
  | { type: 'setTagFilter'; value: string | null }
  | { type: 'setSort'; value: SortMode }
  | { type: 'hydrate'; state: State };

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  return {
    notes: [],
    selectedId: null,
    search: '',
    tagFilter: null,
    sort: 'updated'
  };
}

function persist(state: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'add': {
      const now = Date.now();
      const newNote: Note = {
        id: uid(),
        title: '',
        body: '',
        tags: [],
        pinned: false,
        createdAt: now,
        updatedAt: now,
        ...action.payload
      };
      const next = { ...state, notes: [newNote, ...state.notes], selectedId: newNote.id };
      persist(next);
      return next;
    }
    case 'update': {
      const nextNotes = state.notes.map((n) =>
        n.id === action.id ? { ...n, ...action.changes, updatedAt: Date.now() } : n
      );
      const next = { ...state, notes: nextNotes };
      persist(next);
      return next;
    }
    case 'delete': {
      const nextNotes = state.notes.filter((n) => n.id !== action.id);
      const nextSelected = state.selectedId === action.id ? null : state.selectedId;
      const next = { ...state, notes: nextNotes, selectedId: nextSelected };
      persist(next);
      return next;
    }
    case 'select': {
      const next = { ...state, selectedId: action.id };
      persist(next);
      return next;
    }
    case 'togglePin': {
      const nextNotes = state.notes.map((n) =>
        n.id === action.id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
      );
      const next = { ...state, notes: nextNotes };
      persist(next);
      return next;
    }
    case 'addTag': {
      const tag = normalizeTag(action.tag);
      const nextNotes = state.notes.map((n) =>
        n.id === action.id && tag
          ? { ...n, tags: Array.from(new Set([...(n.tags || []), tag])), updatedAt: Date.now() }
          : n
      );
      const next = { ...state, notes: nextNotes };
      persist(next);
      return next;
    }
    case 'removeTag': {
      const tag = normalizeTag(action.tag);
      const nextNotes = state.notes.map((n) =>
        n.id === action.id ? { ...n, tags: (n.tags || []).filter((t) => t !== tag) } : n
      );
      const next = { ...state, notes: nextNotes };
      persist(next);
      return next;
    }
    case 'setSearch': {
      const next = { ...state, search: action.value };
      persist(next);
      return next;
    }
    case 'setTagFilter': {
      const next = { ...state, tagFilter: action.value };
      persist(next);
      return next;
    }
    case 'setSort': {
      const next = { ...state, sort: action.value };
      persist(next);
      return next;
    }
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const NotesCtx = createContext<Ctx | undefined>(undefined);

// PUBLIC_INTERFACE
export function useNotes() {
  /** Access the Notes state and dispatch. */
  const ctx = useContext(NotesCtx);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }: { children: React.ReactNode }) {
  /** Provider wrapping app with notes state persisted in localStorage. */
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  // Sync selection with ?note=<id> query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('note');
    if (id) {
      dispatch({ type: 'select', id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL param updated
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (state.selectedId) params.set('note', state.selectedId);
    else params.delete('note');
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', next);
  }, [state.selectedId]);

  // Initial persist if not existing
  useEffect(() => {
    persist(state);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <NotesCtx.Provider value={value}>{children}</NotesCtx.Provider>;
}

// Expose reducer for tests
export const __TESTING__ = { reducer, loadInitial };
