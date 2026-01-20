import React from 'react';
import { type GameState } from '../game/types';
import { GAME_CONFIG } from '../config';
import './WorldMap.css';

interface WorldMapProps {
    state: GameState;
    onSelectRegion: (regionId: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ state, onSelectRegion }) => {
    return (
        <div className="world-map">
            <h3>World Tour Progress</h3>
            <div className="regions-list">
                {GAME_CONFIG.REGIONS.map(region => {
                    const isUnlocked = state.reputation >= region.unlockReputation;
                    const isCurrent = state.currentRegionId === region.id;
                    const isBossDefeated = state.defeatedBosses.includes(region.bossId);

                    return (
                        <div
                            key={region.id}
                            className={`region-card ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`}
                        >
                            <div className="region-header">
                                <span className="region-name">{region.name}</span>
                                {isBossDefeated && <span className="conquered-badge">CONQUERED</span>}
                            </div>
                            <p className="region-desc">{region.description}</p>
                            <div className="region-stats">
                                <span className="stat">Multiplier: {region.multiplier}x</span>
                                {!isUnlocked && (
                                    <span className="requirement">Req: {region.unlockReputation} Reputation</span>
                                )}
                            </div>
                            {isUnlocked && !isCurrent && (
                                <button className="travel-btn" onClick={() => onSelectRegion(region.id)}>
                                    Travel
                                </button>
                            )}
                            {isCurrent && <div className="current-badge">Currently Here</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
