import React from 'react';
import { type GameState } from '../game/types';
import { GAME_CONFIG } from '../config';
import { getUpgradeCost } from '../game/engine';

interface UpgradesPanelProps {
    state: GameState;
    onBuy: (id: string) => void;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ state, onBuy }) => {
    return (
        <section className="upgrades-panel">
            <h2>Upgrades</h2>
            <div className="upgrades-list">
                {GAME_CONFIG.UPGRADES.map(u => {
                    const currentLevel = state.upgrades[u.id] || 0;
                    const cost = getUpgradeCost(u, currentLevel);
                    const canAfford = state.honks >= cost;
                    const isLocked = u.reqUnlockId && !state.unlocks[u.reqUnlockId];

                    if (isLocked) {
                        return (
                            <div key={u.id} className="upgrade-card locked">
                                <p>??? (Requires {GAME_CONFIG.UNLOCKS.COLLEGE.name})</p>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={u.id}
                            className="upgrade-card"
                            onClick={() => onBuy(u.id)}
                            disabled={!canAfford}
                        >
                            <div className="upgrade-info">
                                <span className="upgrade-name">{u.name} (Lvl {currentLevel})</span>
                                <span className="upgrade-desc">{u.description}</span>
                            </div>
                            <div className="upgrade-cost">
                                {cost} Honks
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
