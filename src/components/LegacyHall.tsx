import React from 'react';
import { type GameState } from '../game/types';
import { GAME_CONFIG } from '../config';
import { formatNumber } from '../utils/formatting';
import './LegacyHall.css';

interface LegacyHallProps {
    state: GameState;
    onBuyLegacy: (upgradeId: string) => void;
    onAccredit: () => void;
    onEfficiencyAudit: () => void;
}

export const LegacyHall: React.FC<LegacyHallProps> = ({ state, onBuyLegacy, onAccredit, onEfficiencyAudit }) => {
    const canAccend = state.totalHonksEarned >= GAME_CONFIG.ASCENSION_THRESHOLD;
    const gainedFeathers = Math.floor(state.totalHonksEarned / GAME_CONFIG.ASCENSION_THRESHOLD);

    return (
        <div className="legacy-hall">
            <div className="prestige-section">
                <h3>University Accreditation</h3>
                <p>Gain global recognition in exchange for resetting your university's local progress.</p>
                <div className="accreditation-info">
                    <div className="info-item">
                        <span className="label">Current Prestige:</span>
                        <span className="value golden">{formatNumber(state.goldenFeathers)} Feathers</span>
                    </div>
                    {canAccend && (
                        <div className="gain-preview">
                            <span className="gain-text">Ascend now for +{formatNumber(gainedFeathers)} Feathers</span>
                            <button className="accredit-btn" onClick={onAccredit}>
                                Accredit University
                            </button>
                        </div>
                    )}
                    {!canAccend && (
                        <div className="requirement-text">
                            Next Accreditation at {formatNumber(GAME_CONFIG.ASCENSION_THRESHOLD)} Total Honks
                        </div>
                    )}
                </div>
            </div>

            <div className="legacy-upgrades">
                <h4>Permanent Perks</h4>
                <div className="upgrades-list">
                    {GAME_CONFIG.LEGACY_UPGRADES.map(upgrade => {
                        const level = state.legacyUpgrades[upgrade.id] || 0;
                        const cost = upgrade.baseCost + (level * 2);
                        const canAfford = state.goldenFeathers >= cost;

                        return (
                            <div key={upgrade.id} className={`upgrade-card legacy ${!canAfford ? 'disabled' : ''}`}>
                                <div className="upgrade-info">
                                    <span className="upgrade-name">{upgrade.name} (Lv.{level})</span>
                                    <span className="upgrade-desc">{upgrade.description}</span>
                                </div>
                                <button
                                    className="buy-btn"
                                    disabled={!canAfford}
                                    onClick={() => onBuyLegacy(upgrade.id)}
                                >
                                    Cost: {cost} F
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="admin-office">
                <h4>Administrative Office</h4>
                <p>Manage the university's growing bureaucracy.</p>
                <div className="friction-stats">
                    <div className="stat">
                        <span className="label">Current Administrative Friction:</span>
                        <span className="value danger">-{Math.floor(Math.floor(state.totalUpgradesPurchased / 10) * (GAME_CONFIG as any).FRICTION_PER_10_UPGRADES * 100)}%</span>
                    </div>
                    <div className="stat">
                        <span className="label">Total Upgrades Managed:</span>
                        <span className="value">{state.totalUpgradesPurchased}</span>
                    </div>
                </div>

                {state.totalUpgradesPurchased >= 10 && (
                    <div className="audit-action">
                        <h5>Efficiency Audit v{state.totalAuditsPerformed + 1}</h5>
                        <p className="audit-desc">Reset Administrative Friction to zero. Requirements increase per audit.</p>
                        <button
                            className="audit-btn"
                            onClick={onEfficiencyAudit}
                            disabled={state.honks < (GAME_CONFIG as any).AUDIT_BASE_COST_HONKS * Math.pow(2, state.totalAuditsPerformed) || state.funding < (GAME_CONFIG as any).AUDIT_BASE_COST_FUNDING * Math.pow(2, state.totalAuditsPerformed)}
                        >
                            Audit & Streamline (Cost: {formatNumber((GAME_CONFIG as any).AUDIT_BASE_COST_HONKS * Math.pow(2, state.totalAuditsPerformed))} H | {formatNumber((GAME_CONFIG as any).AUDIT_BASE_COST_FUNDING * Math.pow(2, state.totalAuditsPerformed))} FUND)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
