# Hey - Note Taker (Frontend)

A single-page Note Taker built with Vite + React + TypeScript using the Ocean Professional theme.

Features:
- LocalStorage persistence under key `hey.notes.v1`
- Create, update, delete notes
- Pin/Unpin, tags add/remove
- Search and tag filter
- Sorting by Updated or Title with pinned-first
- Responsive split layout (list + editor)
- Accessibility: semantic roles, labels, focus ring, keyboard shortcut Cmd/Ctrl+S to save
- Minimal tests with Vitest

Scripts:
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run test` — run unit tests
- `npm run lint` — lint
- `npm run format` — format with Prettier

Getting Started:
1. `npm install`
2. `npm run dev` and open http://localhost:5173

No external services or env vars required.

Project structure:
- `src/state/NotesContext.tsx` — reducer + context with persistence
- `src/hooks/useFilteredNotes.ts` — search/filter/sort
- `src/components/` — Header, NoteList, Editor
- `src/utils/` — types, helpers
- `src/styles.css` — theme/styles
