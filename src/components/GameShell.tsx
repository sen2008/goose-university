import { useState } from 'react';
import { type GameState } from '../game/types';
import { Header } from './Header';
import { ProgressionPanel } from './ProgressionPanel';
import { UpgradesPanel } from './UpgradesPanel';
import { StatsPanel } from './StatsPanel';
import { SettingsModal } from './SettingsModal';
import { Mascot } from './Mascot';
import { BattlePanel } from './BattlePanel';
import { LegacyHall } from './LegacyHall';
import { WorldMap } from './WorldMap';

interface GameShellProps {
    state: GameState;
    onBuy: (id: string) => void;
    onReset: () => void;
    onMascotClick: () => void;
    onBattle: (rivalId: string) => void;
    onSelectCollege: (collegeId: string) => void;
    onBuyLegacy: (upgradeId: string) => void;
    onAccredit: () => void;
    onEfficiencyAudit: () => void;
    onSelectRegion: (regionId: string) => void;
    selectedCostume: string;
}

export const GameShell: React.FC<GameShellProps> = ({ state, onBuy, onReset, onMascotClick, onBattle, onSelectCollege, onBuyLegacy, onAccredit, onEfficiencyAudit, onSelectRegion, selectedCostume }) => {
    const [showStats, setShowStats] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="game-shell">
            <Header state={state} />

            <main className="game-content">
                <div className="left-col">
                    <Mascot onClick={onMascotClick} selectedCostume={selectedCostume} />
                    <UpgradesPanel state={state} onBuy={onBuy} />
                </div>
                <div className="right-col">
                    <ProgressionPanel state={state} />
                    <WorldMap state={state} onSelectRegion={onSelectRegion} />
                    <BattlePanel state={state} onBattle={onBattle} onSelectCollege={onSelectCollege} />
                    <LegacyHall state={state} onBuyLegacy={onBuyLegacy} onAccredit={onAccredit} onEfficiencyAudit={onEfficiencyAudit} />
                </div>
            </main>

            {showStats && <StatsPanel state={state} onClose={() => setShowStats(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onReset={onReset} />}

            <footer className="game-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="stats-btn" onClick={() => setShowStats(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    View Stats
                </button>
                <button className="settings-btn" onClick={() => setShowSettings(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#555' }}>
                    Settings
                </button>
            </footer>
        </div>
    );
};
