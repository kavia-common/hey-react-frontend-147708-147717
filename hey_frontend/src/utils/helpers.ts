export const STORAGE_KEY = 'hey.notes.v1';

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString();
}

export function normalizeTag(t: string): string {
  return t.trim().toLowerCase().replace(/\s+/g, '-');
}
