import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFilteredNotes } from './useFilteredNotes';
import type { Note } from '../utils/types';

const base = (over: Partial<Note> = {}): Note => ({
  id: '1',
  title: '',
  body: '',
  tags: [],
  pinned: false,
  createdAt: 1,
  updatedAt: 1,
  ...over
});

describe('useFilteredNotes', () => {
  it('filters by query', () => {
    const notes = [base({ id: 'a', title: 'Hello' }), base({ id: 'b', body: 'world' })];
    const { result, rerender } = renderHook(
      ({ q }) => useFilteredNotes(notes, q, null, 'updated'),
      { initialProps: { q: 'hello' } }
    );
    expect(result.current.map((n) => n.id)).toEqual(['a']);
    rerender({ q: 'world' } as any);
    expect(result.current.map((n) => n.id)).toEqual(['b']);
  });

  it('filters by tag and sorts pinned first', () => {
    const notes = [
      base({ id: 'a', title: 'A', tags: ['work'], updatedAt: 2 }),
      base({ id: 'b', title: 'B', tags: ['home'], updatedAt: 3, pinned: true })
    ];
    const { result } = renderHook(() => useFilteredNotes(notes, '', 'home', 'updated'));
    expect(result.current.map((n) => n.id)).toEqual(['b']);
  });

  it('sorts by title', () => {
    const notes = [base({ id: 'b', title: 'Banana' }), base({ id: 'a', title: 'apple' })];
    const { result } = renderHook(() => useFilteredNotes(notes, '', null, 'title'));
    expect(result.current.map((n) => n.id)).toEqual(['a', 'b']);
  });
});
