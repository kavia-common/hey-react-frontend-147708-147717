import { describe, expect, it } from 'vitest';
import { __TESTING__ } from './NotesContext';
import { STORAGE_KEY } from '../utils/helpers';

describe('Notes reducer', () => {
  const { reducer, loadInitial } = __TESTING__;

  it('should load initial state', () => {
    const s = loadInitial();
    expect(s.notes).toEqual([]);
    expect(s.sort).toBe('updated');
  });

  it('should add and update a note', () => {
    let state = loadInitial();
    state = reducer(state, { type: 'add', payload: { title: 'A' } });
    const id = state.selectedId!;
    state = reducer(state, { type: 'update', id, changes: { body: 'body' } });
    const n = state.notes.find((x) => x.id === id)!;
    expect(n.title).toBe('A');
    expect(n.body).toBe('body');
  });

  it('should pin and unpin', () => {
    let state = loadInitial();
    state = reducer(state, { type: 'add' });
    const id = state.selectedId!;
    state = reducer(state, { type: 'togglePin', id });
    expect(state.notes.find((n) => n.id === id)!.pinned).toBe(true);
    state = reducer(state, { type: 'togglePin', id });
    expect(state.notes.find((n) => n.id === id)!.pinned).toBe(false);
  });

  it('should add and remove tag', () => {
    let state = loadInitial();
    state = reducer(state, { type: 'add' });
    const id = state.selectedId!;
    state = reducer(state, { type: 'addTag', id, tag: 'work' });
    expect(state.notes.find((n) => n.id === id)!.tags).toContain('work');
    state = reducer(state, { type: 'removeTag', id, tag: 'work' });
    expect(state.notes.find((n) => n.id === id)!.tags).not.toContain('work');
  });

  it('persists to localStorage key', () => {
    localStorage.clear();
    let state = loadInitial();
    state = reducer(state, { type: 'add', payload: { title: 'Persist' } });
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
  });
});
