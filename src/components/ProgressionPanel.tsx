import React from 'react';
import { type GameState } from '../game/types';
import { GAME_CONFIG } from '../config';

interface ProgressionPanelProps {
    state: GameState;
}

export const ProgressionPanel: React.FC<ProgressionPanelProps> = ({ state }) => {
    // Sort unlocks by threshold
    const sortedUnlocks = Object.values(GAME_CONFIG.UNLOCKS).sort((a, b) => a.threshold - b.threshold);

    return (
        <section className="progression-panel">
            <h3>Progression</h3>
            {sortedUnlocks.map(unlock => {
                const isUnlocked = state.unlocks[unlock.id];
                return (
                    <div key={unlock.id} className={`unlock-card ${isUnlocked ? 'unlocked' : 'locked'}`} style={{ marginBottom: '1rem' }}>
                        <h4>{unlock.name}</h4>
                        {isUnlocked ? (
                            <p className="unlock-active">Active! (x{unlock.multiplier} Multiplier)</p>
                        ) : (
                            <p className="unlock-requirement">Requires {unlock.threshold.toLocaleString()} Total Honks</p>
                        )}
                    </div>
                );
            })}
        </section>
    );
};
