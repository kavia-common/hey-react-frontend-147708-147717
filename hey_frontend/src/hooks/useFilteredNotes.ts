import { useMemo } from 'react';
import { Note, SortMode } from '../utils/types';

function matches(note: Note, q: string, tag: string | null) {
  const query = q.trim().toLowerCase();
  const inQuery =
    !query ||
    note.title.toLowerCase().includes(query) ||
    note.body.toLowerCase().includes(query) ||
    (note.tags || []).some((t) => t.toLowerCase().includes(query));
  const inTag = !tag || (note.tags || []).includes(tag.toLowerCase());
  return inQuery && inTag;
}

function sortNotes(notes: Note[], mode: SortMode): Note[] {
  const arr = [...notes];
  if (mode === 'title') {
    arr.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  } else {
    arr.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  // Pinned first
  arr.sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return arr;
}

// PUBLIC_INTERFACE
export function useFilteredNotes(notes: Note[], query: string, tag: string | null, sort: SortMode) {
  /** Returns notes filtered by query/tag and sorted with pinned-first rule. */
  return useMemo(() => {
    const filtered = notes.filter((n) => matches(n, query, tag));
    return sortNotes(filtered, sort);
  }, [notes, query, tag, sort]);
}
