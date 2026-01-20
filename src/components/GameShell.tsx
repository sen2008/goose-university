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
    const [activeTab, setActiveTab] = useState<'progression' | 'world' | 'battle' | 'legacy'>('progression');

    const tabs = [
        { id: 'progression' as const, label: 'Progression' },
        { id: 'world' as const, label: 'World Map' },
        { id: 'battle' as const, label: 'Battles' },
        { id: 'legacy' as const, label: 'Legacy' },
    ];

    return (
        <div className="game-shell">
            <Header state={state} />

            <nav className="tab-bar" role="tablist" aria-label="Game sections">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main className="game-content">
                <div className="left-stack">
                    <section className="panel panel-mascot">
                        <Mascot onClick={onMascotClick} selectedCostume={selectedCostume} />
                    </section>
                    <section className="panel panel-upgrades">
                        <UpgradesPanel state={state} onBuy={onBuy} />
                    </section>
                </div>
                <section className="panel panel-tabbed">
                    {activeTab === 'progression' && <ProgressionPanel state={state} />}
                    {activeTab === 'world' && <WorldMap state={state} onSelectRegion={onSelectRegion} />}
                    {activeTab === 'battle' && <BattlePanel state={state} onBattle={onBattle} onSelectCollege={onSelectCollege} />}
                    {activeTab === 'legacy' && <LegacyHall state={state} onBuyLegacy={onBuyLegacy} onAccredit={onAccredit} onEfficiencyAudit={onEfficiencyAudit} />}
                </section>
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
