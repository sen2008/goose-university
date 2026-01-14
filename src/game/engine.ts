import { type GameState } from './types';
import { GAME_CONFIG, type UpgradeConfig } from '../config';

export function getUpgradeCost(upgrade: UpgradeConfig, currentLevel: number): number {
    if (upgrade.costScaling === 'linear') {
        return upgrade.baseCost + (currentLevel * upgrade.costFactor);
    } else {
        // exponential
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costFactor, currentLevel));
    }
}

export function calculateRates(state: GameState): number {
    let baseRate = GAME_CONFIG.INITIAL_HONKS_PER_SECOND;
    let multiplier = 1;

    // Process Upgrades
    GAME_CONFIG.UPGRADES.forEach(u => {
        const level = state.upgrades[u.id] || 0;
        if (level > 0) {
            if (u.effectType === 'add') {
                baseRate += (u.effectValue * level);
            } else if (u.effectType === 'multiply') {
                multiplier *= Math.pow(u.effectValue, level);
            }
        }
    });

    // Apply Unlocks Multipliers
    Object.values(GAME_CONFIG.UNLOCKS).forEach(unlock => {
        if (state.unlocks[unlock.id]) {
            multiplier *= unlock.multiplier;
        }
    });

    return baseRate * multiplier;
}

export function tick(state: GameState, elapsedMs: number): GameState {
    const rate = calculateRates(state);
    const gained = rate * (elapsedMs / 1000);

    const newState = {
        ...state,
        honks: state.honks + gained,
        totalHonksEarned: state.totalHonksEarned + gained,
        lastSaveTime: Date.now(),
        timePlayedSeconds: state.timePlayedSeconds + (elapsedMs / 1000),
        honksPerSecond: rate,
    };

    // Check All Unlocks
    let rateUpdateNeeded = false;
    Object.values(GAME_CONFIG.UNLOCKS).forEach(unlock => {
        if (!newState.unlocks[unlock.id] && newState.totalHonksEarned >= unlock.threshold) {
            newState.unlocks = {
                ...newState.unlocks,
                [unlock.id]: true,
            };
            rateUpdateNeeded = true;
        }
    });

    if (rateUpdateNeeded) {
        newState.honksPerSecond = calculateRates(newState);
    }

    return newState;
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = GAME_CONFIG.UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return state;

    // Check requirements
    if (upgrade.reqUnlockId && !state.unlocks[upgrade.reqUnlockId]) {
        return state;
    }

    const currentLevel = state.upgrades[upgradeId] || 0;
    const cost = getUpgradeCost(upgrade, currentLevel);

    if (state.honks < cost) return state; // Can't afford

    const nextState = {
        ...state,
        honks: state.honks - cost,
        upgrades: {
            ...state.upgrades,
            [upgradeId]: currentLevel + 1,
        },
    };

    nextState.honksPerSecond = calculateRates(nextState);
    return nextState;
}
