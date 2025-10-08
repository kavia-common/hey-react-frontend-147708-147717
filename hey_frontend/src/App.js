import React from 'react';
import './App.css';
import Game from './components/Game';

// PUBLIC_INTERFACE
function App() {
  /**
   * This App component serves as the root and renders the Tic Tac Toe Game.
   * It keeps styling minimal and defers UI to the Game component.
   */
  return (
    <div className="App">
      <main className="app-main">
        <Game />
      </main>
    </div>
  );
}

export default App;
