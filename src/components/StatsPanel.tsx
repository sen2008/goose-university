import React from 'react';
import { type GameState } from '../game/types';
import { formatTime, formatNumber } from '../utils/formatting';

interface StatsPanelProps {
    state: GameState;
    onClose: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ state, onClose }) => {
    const totalUpgrades = Object.values(state.upgrades).reduce((a, b) => a + b, 0);

    return (
        <div className="stats-overlay">
            <div className="stats-modal">
                <h2>Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-entry">
                        <span className="label">Total Honks Earned:</span>
                        <span className="value">{formatNumber(Math.floor(state.totalHonksEarned))}</span>
                    </div>
                    <div className="stat-entry">
                        <span className="label">Time Played:</span>
                        <span className="value">{formatTime(state.timePlayedSeconds)}</span>
                    </div>
                    <div className="stat-entry">
                        <span className="label">Upgrades Purchased:</span>
                        <span className="value">{totalUpgrades}</span>
                    </div>
                    <div className="stat-entry">
                        <span className="label">Last Save:</span>
                        <span className="value">{new Date(state.lastSaveTime).toLocaleTimeString()}</span>
                    </div>
                </div>
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
