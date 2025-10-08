import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { NotesProvider } from './state/NotesContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotesProvider>
      <App />
    </NotesProvider>
  </React.StrictMode>
);
