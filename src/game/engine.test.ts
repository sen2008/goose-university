import { describe, it, expect } from 'vitest';
import { tick, buyUpgrade } from './engine';
import { INITIAL_STATE } from './types';
import { GAME_CONFIG } from '../config';

describe('Game Engine', () => {
    it('should initialize correctly', () => {
        expect(INITIAL_STATE.honks).toBe(0);
    });

    it('should accumulate honks over time', () => {
        const nextState = tick(INITIAL_STATE, 1000);
        expect(nextState.honks).toBeGreaterThan(0);
    });

    it('should get correct update costs (linear & exponential)', () => {
        const linear = GAME_CONFIG.UPGRADES.find(u => u.id === 'better_goose')!;
        expect(linear.baseCost).toBe(25); // Mission 4 change

        const expo = GAME_CONFIG.UPGRADES.find(u => u.id === 'goose_trainer')!;
        // Base 100 * 1.5^0 = 100
        // Base 100 * 1.5^1 = 150
        expect(expo.baseCost).toBe(100);
    });

    it('should buy upgrades and track levels', () => {
        const richState = { ...INITIAL_STATE, honks: 1000 };
        const s1 = buyUpgrade(richState, 'better_goose');
        expect(s1.upgrades['better_goose']).toBe(1);
    });

    it('should unlock Division of Feathered Sciences at 2500 total honks', () => {
        const division = GAME_CONFIG.UNLOCKS.DIVISION;
        const preState = {
            ...INITIAL_STATE,
            honks: 0,
            totalHonksEarned: division.threshold - 1,
            unlocks: {} // No unlocks yet
        };

        // Tick to cross threshold
        // 1 sec @ 1 HPS = +1 Honk
        const nextState = tick(preState, 1000);

        expect(nextState.totalHonksEarned).toBeGreaterThanOrEqual(division.threshold);
        expect(nextState.unlocks[division.id]).toBe(true);
    });

    it('should gate Dept upgrades behind Division unlock', () => {
        const deptUpgradeId = 'dept_aerodynamics';
        const richState = { ...INITIAL_STATE, honks: 10000 };

        // Locked
        const failState = buyUpgrade(richState, deptUpgradeId);
        expect(failState.upgrades[deptUpgradeId]).toBeUndefined();

        // Unlocked
        const unlockedState = {
            ...richState,
            unlocks: { [GAME_CONFIG.UNLOCKS.DIVISION.id]: true }
        };
        const successState = buyUpgrade(unlockedState, deptUpgradeId);
        expect(successState.upgrades[deptUpgradeId]).toBe(1);
    });

    it('should stack multipliers (College + Division)', () => {
        const bothUnlocked = {
            ...INITIAL_STATE,
            unlocks: {
                [GAME_CONFIG.UNLOCKS.COLLEGE.id]: true,
                [GAME_CONFIG.UNLOCKS.DIVISION.id]: true
            }
        };

        // Base 1 * 1.25 (College) * 1.5 (Division) = 1.875
        const rate = tick(bothUnlocked, 0).honksPerSecond;
        expect(rate).toBeCloseTo(1.875);
    });
    it('should track time played', () => {
        const s0 = INITIAL_STATE;
        expect(s0.timePlayedSeconds).toBe(0);

        // Tick 1 second
        const s1 = tick(s0, 1000);
        expect(s1.timePlayedSeconds).toBe(1);

        // Tick 1.5 seconds
        const s2 = tick(s1, 1500);
        expect(s2.timePlayedSeconds).toBe(2.5);
    });
});
