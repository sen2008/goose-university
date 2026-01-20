import React from 'react';
import { type GameState } from '../game/types';
import { GAME_CONFIG } from '../config';
import { calculateTeamPower } from '../game/engine';
import { formatNumber } from '../utils/formatting';
import './BattlePanel.css';

interface BattlePanelProps {
    state: GameState;
    onBattle: (rivalId: string) => void;
    onSelectCollege: (collegeId: string) => void;
}

export const BattlePanel: React.FC<BattlePanelProps> = ({ state, onBattle, onSelectCollege }) => {
    const selectedCollegeIds = state.selectedCollegeIds;
    const teamPower = calculateTeamPower(state, selectedCollegeIds);
    const cooldownMs = state.battleState.cooldown;
    const isOnCooldown = cooldownMs > 0;

    const getSynergyText = () => {
        return "";
    };

    return (
        <div className="battle-panel">
            <h3>Tactical Battle Control</h3>

            <div className="college-selector">
                <div className="selector-header">
                    <h4>Select Primary College:</h4>
                    <span className="team-size">{selectedCollegeIds.length}/1</span>
                </div>
                <div className="colleges-grid">
                    {Object.values(GAME_CONFIG.COLLEGES).map(college => {
                        const isActive = selectedCollegeIds.includes(college.id);
                        return (
                            <button
                                key={college.id}
                                className={`college-option ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectCollege(college.id)}
                            >
                                <span className="name">{college.name}</span>
                                <span className={`type-badge ${college.tacticalType.toLowerCase()}`}>
                                    {college.tacticalType}
                                </span>
                                <span className="level">Lv.{state.colleges[college.id]?.level || 1}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="player-stats">
                <div className="stat">
                    <span className="label">Total Team Power:</span>
                    <span className="value">{formatNumber(teamPower)}</span>
                    {getSynergyText() && <span className="synergy-label">{getSynergyText()}</span>}
                </div>
                <div className="stat">
                    <span className="label">Reputation:</span>
                    <span className="value">{state.reputation}</span>
                </div>
            </div>

            {state.battleState.lastResult && (
                <div className={`battle-result ${state.battleState.lastResult.includes('Won') ? 'win' : 'loss'}`}>
                    {state.battleState.lastResult}
                </div>
            )}

            <div className="current-region-info">
                Active Region: <strong>{GAME_CONFIG.REGIONS.find(r => r.id === state.currentRegionId)?.name}</strong>
            </div>

            <div className="rivals-list">
                {GAME_CONFIG.RIVALS.filter(rival => {
                    const region = GAME_CONFIG.REGIONS.find(r => r.id === state.currentRegionId);
                    return region && (region.rivalIds.includes(rival.id) || region.bossId === rival.id);
                }).map(rival => {
                    const powerAgainstRival = calculateTeamPower(state, selectedCollegeIds, rival.id);
                    const rivalMult = state.rivalPowerMultipliers[rival.id] || 1.0;
                    const scaledRivalPower = rival.basePower * rivalMult;
                    const winChance = Math.floor((powerAgainstRival / (powerAgainstRival + scaledRivalPower)) * 100) || 0;

                    const hasAdvantage = selectedCollegeIds.some(cid => {
                        const ctype = GAME_CONFIG.COLLEGES[cid]?.tacticalType;
                        return ctype && GAME_CONFIG.TACTICAL_BONUSES[ctype] === rival.tacticalType;
                    });

                    const isBossDefeated = state.defeatedBosses.includes(rival.id);

                    return (
                        <div key={rival.id} className={`rival-card ${hasAdvantage ? 'advantaged' : ''} ${rival.isBoss ? 'boss-card' : ''} ${isBossDefeated ? 'conquered' : ''}`}>
                            <div className="rival-info">
                                <div className="rival-name">
                                    {rival.isBoss && <span className="boss-tag">BOSS:</span>}
                                    {rival.name}
                                    <span className={`rival-type ${rival.tacticalType.toLowerCase()}`}>{rival.tacticalType}</span>
                                </div>
                                {hasAdvantage && <div className="advantage-badge">ADVANTAGE!</div>}
                                <div className="rival-details">
                                    Power: {formatNumber(scaledRivalPower)} | Win Chance: {winChance}%
                                </div>
                                <div className="rival-intel" style={{ fontSize: '0.7rem', color: '#888' }}>
                                    Scaled Difficulty: {rivalMult.toFixed(2)}x
                                </div>
                            </div>
                            <button
                                className="battle-btn"
                                onClick={() => onBattle(rival.id)}
                                disabled={isOnCooldown || isBossDefeated}
                            >
                                {isBossDefeated ? 'Defeated' : (isOnCooldown ? `${Math.ceil(cooldownMs / 1000)}s` : (rival.isBoss ? 'CHALLENGE' : 'Fight'))}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
