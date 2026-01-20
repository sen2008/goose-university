import React from 'react';
import { type GameState } from '../game/types';
import { formatNumber } from '../utils/formatting';

interface HeaderProps {
    state: GameState;
}

export const Header: React.FC<HeaderProps> = ({ state }) => {
    return (
        <header className="game-header">
            <h1>GooseUniversity</h1>
            <div className="stats-row">
                <div className="stat-item">
                    <span className="stat-value">{formatNumber(state.honks)}</span>
                    <span className="stat-label">Honks</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{formatNumber(state.honksPerSecond)}</span>
                    <span className="stat-label">/ sec</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{formatNumber(state.reputation)}</span>
                    <span className="stat-label">Reputation</span>
                </div>
            </div>
            <div className="stats-row secondary">
                <div className="stat-item feather">
                    <span className="stat-value">{formatNumber(state.goldenFeathers)}</span>
                    <span className="stat-label">Feathers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{formatNumber(state.students)}</span>
                    <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">${formatNumber(state.funding)}</span>
                    <span className="stat-label">Funding</span>
                </div>
            </div>
        </header>
    );
};
