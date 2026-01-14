import { useState } from 'react';
import { type GameState } from '../game/types';
import { Header } from './Header';
import { ProgressionPanel } from './ProgressionPanel';
import { UpgradesPanel } from './UpgradesPanel';
import { StatsPanel } from './StatsPanel';

interface GameShellProps {
    state: GameState;
    onBuy: (id: string) => void;
    onReset: () => void;
}

export const GameShell: React.FC<GameShellProps> = ({ state, onBuy, onReset }) => {
    const [showStats, setShowStats] = useState(false);

    return (
        <div className="game-shell">
            <Header state={state} />

            <main className="game-content">
                <div className="left-col">
                    <UpgradesPanel state={state} onBuy={onBuy} />
                </div>
                <div className="right-col">
                    <ProgressionPanel state={state} />
                </div>
            </main>

            {showStats && <StatsPanel state={state} onClose={() => setShowStats(false)} />}

            <footer className="game-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="stats-btn" onClick={() => setShowStats(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    View Stats
                </button>
                <button className="reset-btn" onClick={() => {
                    if (confirm("Are you sure you want to reset your save?")) {
                        onReset();
                    }
                }}>Reset Save</button>
            </footer>
        </div>
    );
};
