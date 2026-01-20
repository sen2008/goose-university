import { useState, useEffect, useRef } from 'react'
import { loadGame, saveGame, resetGame } from './game/storage'
import { tick, buyUpgrade, clickGoose, resolveBattle, selectCollege, accreditUniversity, buyLegacyUpgrade, selectRegion, buyEfficiencyAudit } from './game/engine'
import { GameShell } from './components/GameShell'
import { ReloadPrompt } from './components/ReloadPrompt'
import { ErrorBoundary } from './components/ErrorBoundary'
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

  // Hold current state in a ref for interval access without re-triggering effects
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Autosave periodically
  useEffect(() => {
    if (!inGame) return;
    const saveInterval = setInterval(() => {
      const now = Date.now();
      // Update both storage AND React state
      setState(prev => {
        const next = { ...prev, lastSaveTime: now };
        saveGame(next);
        return next;
      });
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [inGame]); // No 'state' here to avoid 100ms re-runs

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

  const handleMascotClick = () => {
    setState(prev => clickGoose(prev));
  };

  const handleBattle = (rivalId: string) => {
    setState(prev => resolveBattle(prev, rivalId));
  };

  const handleSelectCollege = (collegeId: string) => {
    setState(prev => selectCollege(prev, collegeId));
  };

  const handleAccredit = () => {
    if (window.confirm("Are you sure you want to Accredit your University? This will reset your honks, upgrades, and normal unlocks, but you will earn Golden Feathers for permanent power!")) {
      setState(prev => accreditUniversity(prev));
    }
  };

  const handleBuyLegacy = (upgradeId: string) => {
    setState(prev => buyLegacyUpgrade(prev, upgradeId));
  };

  const handleSelectRegion = (regionId: string) => {
    setState(prev => selectRegion(prev, regionId));
  };

  const handleEfficiencyAudit = () => {
    setState(prev => buyEfficiencyAudit(prev));
  };

  return (
    <div className="app-container">
      <ErrorBoundary>
        <ReloadPrompt />
        {inGame ? (
          <GameShell
            state={state}
            onBuy={handleBuy}
            onReset={handleReset}
            onMascotClick={handleMascotClick}
            onBattle={handleBattle}
            onSelectCollege={handleSelectCollege}
            onBuyLegacy={handleBuyLegacy}
            onAccredit={handleAccredit}
            onEfficiencyAudit={handleEfficiencyAudit}
            onSelectRegion={handleSelectRegion}
            selectedCostume={state.selectedCostume}
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
      </ErrorBoundary>
    </div>
  )
}

export default App
