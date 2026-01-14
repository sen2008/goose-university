import React from 'react';
import { type GameState } from '../game/types';

interface HeaderProps {
    state: GameState;
}

export const Header: React.FC<HeaderProps> = ({ state }) => {
    return (
        <header className="game-header">
            <h1>GooseUniversity</h1>
            <div className="stats-row">
                <div className="stat-item">
                    <span className="stat-value">{Math.floor(state.honks)}</span>
                    <span className="stat-label">Honks</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{state.honksPerSecond.toFixed(1)}</span>
                    <span className="stat-label">/ sec</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{Math.floor(state.totalHonksEarned)}</span>
                    <span className="stat-label">Lifetime</span>
                </div>
            </div>
        </header>
    );
};
