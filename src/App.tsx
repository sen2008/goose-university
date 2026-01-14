import { useState, useEffect } from 'react'
import { loadGame, saveGame, resetGame } from './game/storage'
import { tick, buyUpgrade } from './game/engine'
import { GameShell } from './components/GameShell'
import { ReloadPrompt } from './components/ReloadPrompt'
import './App.css'

function App() {
  const [inGame, setInGame] = useState(false);
  const [state, setState] = useState(() => loadGame());

  // Game Loop
  useEffect(() => {
    if (!inGame) return;

    const intervalId = setInterval(() => {
      setState(prev => tick(prev, 100)); // 100ms tick
    }, 100);

    return () => clearInterval(intervalId);
  }, [inGame]);

  // Autosave periodically
  useEffect(() => {
    if (!inGame) return;
    const saveInterval = setInterval(() => {
      saveGame(state);
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [inGame, state]);

  // Autosave on unload
  useEffect(() => {
    const handleUnload = () => saveGame(state);
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [state]);

  const handleBuy = (id: string) => {
    setState(prev => buyUpgrade(prev, id));
  };

  const handleReset = () => {
    const newState = resetGame();
    setState(newState);
    setInGame(false);
  };

  return (
    <div className="app-container">
      <ReloadPrompt />
      {inGame ? (
        <GameShell
          state={state}
          onBuy={handleBuy}
          onReset={handleReset}
        />
      ) : (
        <div className="home-screen">
          <h1>GooseUniversity</h1>
          <ReloadPrompt />
          <button onClick={() => setInGame(true)}>
            {state.honks > 0 ? "Continue Game" : "New Game"}
          </button>
        </div>
      )}
    </div>
  )
}

export default App
