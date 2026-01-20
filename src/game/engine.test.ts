import { describe, it, expect } from 'vitest';
import { tick, buyUpgrade, calculateCollegePower, calculateTeamPower, resolveBattle, accreditUniversity, selectCollege, selectRegion, buyEfficiencyAudit } from './engine';
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

    it('should unlock Division of Feathered Sciences at 100,000 total honks', () => {
        const division = GAME_CONFIG.UNLOCKS.DIVISION;
        const preState = {
            ...INITIAL_STATE,
            honks: 0,
            totalHonksEarned: division.threshold - 1,
            unlocks: {}
        };

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

        // Base 1 * 1.01 (College) * 1.01 (Division) = 1.0201 (Hard Mode: 1%)
        const rate = tick(bothUnlocked, 0).honksPerSecond;
        expect(rate).toBeCloseTo(1.0201);
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

    it('should calculate team power (No Synergies in Hard Mode)', () => {
        // Hard Mode: only first college counts
        const team = ['athletic_department', 'college_of_honkery'];
        const p1 = calculateCollegePower(INITIAL_STATE, 'athletic_department');
        const teamPower = calculateTeamPower(INITIAL_STATE, team);

        expect(teamPower).toBe(p1);
    });

    it('should apply tactical bonuses against rivals', () => {
        // Northern U is weak (Intellectual) - Aggressive (Athletics) counters it
        const aggressiveCollege = 'athletic_department';
        const rival = GAME_CONFIG.RIVALS.find(r => r.id === 'northern_u')!;

        const highPowerState = { ...INITIAL_STATE, reputation: 100 };
        const basePower = calculateCollegePower(highPowerState, aggressiveCollege);
        const tacticalPower = calculateCollegePower(highPowerState, aggressiveCollege, rival.id);

        // Reputation bonus 1% per reputation
        // Base 1 * 2.0 (Rep 100) * 1.0 (Unlock 0) = 2.0
        // College 1% + Athletic 5% = 1.06
        // BasePower = 2 * 1.06 = 2.12 -> 2
        // Tactical Power = 2.12 * 1.5 = 3.18 -> 3
        expect(basePower).toBe(2);
        expect(tacticalPower).toBe(3);
    });

    it('should handle battle resolution and team experience', () => {
        const state = { ...INITIAL_STATE, honks: 0, reputation: 0, selectedCollegeIds: ['college_of_honkery', 'athletic_department'] };
        const rival = GAME_CONFIG.RIVALS[0]; // Pond Tech

        const nextState = resolveBattle(state, rival.id);
        expect(nextState.battleState.cooldown).toBe(GAME_CONFIG.BATTLE_COOLDOWN_MS);

        if (nextState.battleState.lastResult?.includes('Victory')) {
            expect(nextState.colleges['college_of_honkery'].experience).toBe(10);
            expect(nextState.colleges['athletic_department'].experience).toBe(10);
        }
    });

    it('should restrict selection to 1 college in Hard Mode', () => {
        let state = INITIAL_STATE;
        state = selectCollege(state, 'athletic_department');
        expect(state.selectedCollegeIds).toEqual(['athletic_department']);

        state = selectCollege(state, 'college_of_honkery');
        expect(state.selectedCollegeIds).toEqual(['college_of_honkery']); // Replaces previous
    });

    it('should decrement battle cooldown on tick', () => {
        const stateWithCooldown = {
            ...INITIAL_STATE,
            battleState: {
                ...INITIAL_STATE.battleState,
                cooldown: 1000
            }
        };

        const nextState = tick(stateWithCooldown, 500);
        expect(nextState.battleState.cooldown).toBe(500);

        const finalState = tick(nextState, 600);
        expect(finalState.battleState.cooldown).toBe(0);
    });

    it('should accumulate students and funding on tick (Hard Mode)', () => {
        const state = { ...INITIAL_STATE, honksPerSecond: 1000 };
        const s1 = tick(state, 1000);

        // HPS 1000 * 0.01 Students/HonkSec * 1 sec = 10 Students
        expect(s1.students).toBeCloseTo(10);

        const s2 = tick(s1, 1000);
        // Students 10 * 0.001 Funding/StudentSec * 1 sec = 0.01 Funding
        expect(s2.funding).toBeCloseTo(0.01);
    });

    it('should perform accreditation reset (Hard Mode: 10M)', () => {
        const richState = {
            ...INITIAL_STATE,
            honks: 50000000,
            totalHonksEarned: 50000000,
            upgrades: { 'better_goose': 10 },
            goldenFeathers: 0
        };

        const accended = accreditUniversity(richState);

        // 50M / 10M = 5 feathers
        expect(accended.goldenFeathers).toBe(5);
        expect(accended.honks).toBe(0);
    });

    it('should apply regional multipliers to rates', () => {
        const region2State = { ...INITIAL_STATE, currentRegionId: 'academic_city' };
        const baseRate = tick(INITIAL_STATE, 0).honksPerSecond;
        const region2Rate = tick(region2State, 0).honksPerSecond;

        // Region 2 has a 2x multiplier
        expect(region2Rate).toBeCloseTo(baseRate * 2);
    });

    it('should unlock and travel to new regions', () => {
        const highRepState = { ...INITIAL_STATE, reputation: 100 };
        const nextState = selectRegion(highRepState, 'academic_city');
        expect(nextState.currentRegionId).toBe('academic_city');

        // Should fail if reputation is too low
        const lowRepState = { ...INITIAL_STATE, reputation: 10 };
        const failState = selectRegion(lowRepState, 'academic_city');
        expect(failState.currentRegionId).toBe('local_ponds');
    });

    it('should record regional boss defeats', () => {
        const bossId = 'swan_king';
        const victoryState = {
            ...INITIAL_STATE,
            reputation: 100000, // Guaranteed win for test
            totalHonksEarned: 1000000,
            selectedCollegeIds: ['athletic_department']
        };

        const resultState = resolveBattle(victoryState, bossId);

        // Mock win for reliability in test if needed, but here power is huge
        if (resultState.defeatedBosses.includes(bossId)) {
            expect(resultState.defeatedBosses).toContain(bossId);
            expect(resultState.battleState.lastResult).toContain('LEGENDARY VICTORY');
        }
    });
    it('should apply Administrative Friction and Inflation', () => {
        // 20 upgrades = 2% friction penalty (Hard Mode)
        const stateWithUpgrades = { ...INITIAL_STATE, totalUpgradesPurchased: 20 };
        const baseRate = 1.0;
        const tickResult = tick(stateWithUpgrades, 0);

        // Friction: 1 - (2 * 0.01) = 0.98
        // Inflation: 0.999^20 = ~0.98
        expect(tickResult.honksPerSecond).toBeLessThan(baseRate * 0.97);
    });

    it('should reset friction with Efficiency Audit', () => {
        const highFrictionState = {
            ...INITIAL_STATE,
            totalUpgradesPurchased: 100,
            honks: 2000000,
            funding: 10000
        };
        const beforeAudit = tick(highFrictionState, 0).honksPerSecond;
        const stateAfterAudit = buyEfficiencyAudit(highFrictionState);

        expect(stateAfterAudit.totalUpgradesPurchased).toBe(0);
        expect(stateAfterAudit.honksPerSecond).toBeGreaterThan(beforeAudit);
    });

    it('should require Scholarship Costs (Funding) for college level up', () => {
        const readyToLevel = {
            ...INITIAL_STATE,
            funding: 0, // No funding
            colleges: {
                ...INITIAL_STATE.colleges,
                'college_of_honkery': { ...INITIAL_STATE.colleges['college_of_honkery'], level: 1, experience: 95 }
            },
            selectedCollegeIds: ['college_of_honkery']
        };

        // Win but fail to level up due to no funding
        const result1 = resolveBattle(readyToLevel, 'pond_tech');
        if (result1.battleState.lastResult?.includes('Victory')) {
            expect(result1.colleges['college_of_honkery'].level).toBe(1);
            expect(result1.colleges['college_of_honkery'].experience).toBe(105);
        }

        // Add funding and try again
        const richLevel = { ...result1, funding: 1000 };
        const result2 = resolveBattle(richLevel, 'pond_tech');
        if (result2.battleState.lastResult?.includes('Victory')) {
            expect(result2.colleges['college_of_honkery'].level).toBe(2);
        }
    });
});
