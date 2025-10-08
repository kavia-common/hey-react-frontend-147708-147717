import React from 'react';
import { Header } from './components/Header';
import { NoteList } from './components/NoteList';
import { Editor } from './components/Editor';

// PUBLIC_INTERFACE
export function App() {
  /** Single-page layout with header, list, and editor panels. */
  return (
    <div className="container">
      <Header />
      <main className="main" role="main">
        <NoteList />
        <Editor />
      </main>
    </div>
  );
}
