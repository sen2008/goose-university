import { type GameState, INITIAL_STATE } from './types';
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

    // expansion: legacy upgrades
    const resonanceLevel = state.legacyUpgrades['golden_resonance'] || 0;
    multiplier *= (1 + (resonanceLevel * 0.1));

    // expansion: regional multiplier
    const region = GAME_CONFIG.REGIONS.find(r => r.id === state.currentRegionId);
    if (region) {
        multiplier *= region.multiplier;
    }

    // Hard Mode: Administrative Friction
    // -1% efficiency for every 10 upgrades purchased
    const frictionLevel = Math.floor(state.totalUpgradesPurchased / 10);
    const frictionPenalty = frictionLevel * (GAME_CONFIG as any).FRICTION_PER_10_UPGRADES;
    multiplier *= Math.max(0.1, 1 - frictionPenalty);

    // Hard Mode: Inflation
    // Global multiplier decays by 0.1% per upgrade purchased
    const inflationFactor = Math.pow(0.999, state.totalUpgradesPurchased);
    multiplier *= inflationFactor;

    return baseRate * multiplier;
}

export function tick(state: GameState, elapsedMs: number): GameState {
    const rate = calculateRates(state);
    const elapsedSec = elapsedMs / 1000;
    const gained = rate * elapsedSec;

    // Student/Funding growth
    const studentMult = 1 + ((state.legacyUpgrades['recruitment_drive'] || 0) * 0.25);
    const newStudents = state.honksPerSecond * GAME_CONFIG.STUDENTS_PER_HONK_SEC * elapsedSec * studentMult;

    // Funding is driven by students
    const fundingMult = 1; // Placeholder for future upgrades
    const newFunding = state.students * GAME_CONFIG.FUNDING_PER_STUDENT_SEC * elapsedSec * fundingMult;

    // Cooldown reduction legacy
    const mobilityLevel = state.legacyUpgrades['dept_migratory_studies_legacy'] || 0; // naming might differ

    // Each level reduces cooldown by 5%
    const cooldownReductionMult = Math.max(0.1, 1 - (mobilityLevel * 0.05));
    const activeCooldownReduction = elapsedMs * (1 / cooldownReductionMult);

    const newState = {
        ...state,
        honks: state.honks + gained,
        totalHonksEarned: state.totalHonksEarned + gained,
        timePlayedSeconds: state.timePlayedSeconds + elapsedSec,
        honksPerSecond: rate,
        students: state.students + newStudents,
        funding: state.funding + newFunding,
        battleState: {
            ...state.battleState,
            cooldown: Math.max(0, state.battleState.cooldown - activeCooldownReduction),
        }
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

            // Grant costume if applicable
            if (unlock.costumeId && !newState.unlockedCostumes.includes(unlock.costumeId)) {
                newState.unlockedCostumes = [...newState.unlockedCostumes, unlock.costumeId];
                newState.selectedCostume = unlock.costumeId; // Auto-equip new costumes
            }
        }
    });

    if (rateUpdateNeeded) {
        newState.honksPerSecond = calculateRates(newState);
    }

    return newState;
}

export function selectCostume(state: GameState, costumeId: string): GameState {
    if (!state.unlockedCostumes.includes(costumeId)) return state;
    return {
        ...state,
        selectedCostume: costumeId,
    };
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
        totalUpgradesPurchased: state.totalUpgradesPurchased + 1,
    };

    nextState.honksPerSecond = calculateRates(nextState);
    return nextState;
}

export function clickGoose(state: GameState): GameState {
    const amount = 1; // Base click amount
    return {
        ...state,
        honks: state.honks + amount,
        totalHonksEarned: state.totalHonksEarned + amount,
    };
}

export function selectCollege(state: GameState, collegeId: string): GameState {
    // Hard Mode: Only one college selection allowed
    return {
        ...state,
        selectedCollegeIds: [collegeId],
    };
}

export function calculateTeamPower(state: GameState, collegeIds: string[], rivalId?: string): number {
    // Hard Mode: No team synergies, just the single college
    if (collegeIds.length === 0) return 0;
    const power = calculateCollegePower(state, collegeIds[0], rivalId);
    return Math.floor(power);
}

export function calculateCollegePower(state: GameState, collegeId: string, rivalId?: string): number {
    const college = state.colleges[collegeId];
    if (!college) return 0;

    const rate = calculateRates(state);
    const reputationBonus = 1 + (state.reputation * 0.01); // Hard Mode: 1% instead of 10%
    const progressionBonus = 1 + (Object.keys(state.unlocks).length * 0.01); // Hard Mode: 1%
    const basePower = rate * reputationBonus * progressionBonus;

    // College specific bonuses
    let collegeMultiplier = 1 + (college.level * 0.01); // Hard Mode: 1% per level

    // Legacy Power Bonus
    const diplomacyLevel = state.legacyUpgrades['avian_diplomacy'] || 0;
    collegeMultiplier += (diplomacyLevel * 0.01); // Hard Mode: 1%

    const config = GAME_CONFIG.COLLEGES[collegeId];
    if (!config) return Math.floor(basePower * collegeMultiplier);

    if (config.primaryStat === 'power_bonus') {
        collegeMultiplier += 0.05; // Hard Mode: 5% instead of 50%
    }

    // Tactical Multiplier (Informational)
    if (rivalId) {
        const rivalCfg = GAME_CONFIG.RIVALS.find(r => r.id === rivalId);
        if (rivalCfg) {
            const collegeType = config.tacticalType;
            if (GAME_CONFIG.TACTICAL_BONUSES[collegeType] === rivalCfg.tacticalType) {
                collegeMultiplier *= GAME_CONFIG.TACTICAL_MULTIPLIER;
            }
        }
    }

    return Math.floor(basePower * collegeMultiplier);
}

export function resolveBattle(state: GameState, rivalId: string): GameState {
    const rival = GAME_CONFIG.RIVALS.find(r => r.id === rivalId);
    if (!rival || state.battleState.cooldown > 0) return state;

    const teamIds = state.selectedCollegeIds;
    const userPower = calculateTeamPower(state, teamIds, rivalId);

    // Hard Mode: Rival scales based on victory count
    const rivalMult = state.rivalPowerMultipliers[rivalId] || 1.0;
    const rivalPower = rival.basePower * rivalMult;

    const totalPower = userPower + rivalPower;
    const winChance = totalPower > 0 ? userPower / totalPower : 0;
    const win = Math.random() < winChance;

    const nextState = {
        ...state,
        battleState: {
            ...state.battleState,
            cooldown: GAME_CONFIG.BATTLE_COOLDOWN_MS,
            lastResult: win ? `Victory! You overthrew ${rival.name}!` : `Defeat! ${rival.name} was too strong.`,
        }
    };

    if (win) {
        nextState.reputation += rival.rewardReputation;
        nextState.honks += rival.rewardHonks;
        nextState.totalHonksEarned += rival.rewardHonks;

        // Grant Experience and Level Ups
        const newColleges = { ...nextState.colleges };
        teamIds.forEach(id => {
            const currentCollege = { ...newColleges[id] };
            currentCollege.experience += 10;

            // Hard Mode: Scholarship Costs
            // Leveling up requires Funding (level * 100)
            const levelUpCost = currentCollege.level * 100;
            if (currentCollege.experience >= 100 && nextState.funding >= levelUpCost) {
                currentCollege.level += 1;
                currentCollege.experience -= 100;
                nextState.funding -= levelUpCost;
            }
            newColleges[id] = currentCollege;
        });
        nextState.colleges = newColleges;

        // Hard Mode: Rival Scaling
        const currentMult = state.rivalPowerMultipliers[rivalId] || 1.0;
        nextState.rivalPowerMultipliers = {
            ...nextState.rivalPowerMultipliers,
            [rivalId]: currentMult * (GAME_CONFIG as any).RIVAL_SCALING_PER_VICTORY,
        };

        // Check for Boss Defeat
        if (rival.isBoss && !nextState.defeatedBosses.includes(rivalId)) {
            nextState.defeatedBosses = [...nextState.defeatedBosses, rivalId];
            nextState.battleState.lastResult = `LEGENDARY VICTORY! Boss ${rival.name} has fallen!`;
        }
    }

    return nextState;
}

export function accreditUniversity(state: GameState): GameState {
    // Prestige Reset
    if (state.totalHonksEarned < GAME_CONFIG.ASCENSION_THRESHOLD) return state;

    const gainedFeathers = Math.floor(state.totalHonksEarned / GAME_CONFIG.ASCENSION_THRESHOLD);

    const nextState = {
        ...INITIAL_STATE,
        goldenFeathers: state.goldenFeathers + gainedFeathers,
        legacyUpgrades: { ...state.legacyUpgrades },
        unlockedCostumes: [...state.unlockedCostumes], // keep costumes
        selectedCostume: state.selectedCostume,
        timePlayedSeconds: state.timePlayedSeconds, // Keep total time
    };

    nextState.honksPerSecond = calculateRates(nextState);
    return nextState;
}

export function buyLegacyUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = GAME_CONFIG.LEGACY_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return state;

    const currentLevel = state.legacyUpgrades[upgradeId] || 0;
    const cost = upgrade.baseCost + (currentLevel * 2); // Simple scaling for now

    if (state.goldenFeathers < cost) return state;

    const nextState = {
        ...state,
        goldenFeathers: state.goldenFeathers - cost,
        legacyUpgrades: {
            ...state.legacyUpgrades,
            [upgradeId]: currentLevel + 1,
        }
    };

    nextState.honksPerSecond = calculateRates(nextState);
    return nextState;
}

export function selectRegion(state: GameState, regionId: string): GameState {
    const region = GAME_CONFIG.REGIONS.find(r => r.id === regionId);
    if (!region) return state;

    // Check unlock condition (reputation)
    if (state.reputation < region.unlockReputation) return state;

    const nextState = {
        ...state,
        currentRegionId: regionId,
    };

    nextState.honksPerSecond = calculateRates(nextState);
    return nextState;
}

export function buyEfficiencyAudit(state: GameState): GameState {
    const costHonks = (GAME_CONFIG as any).AUDIT_BASE_COST_HONKS * Math.pow(2, state.totalAuditsPerformed);
    const costFunding = (GAME_CONFIG as any).AUDIT_BASE_COST_FUNDING * Math.pow(2, state.totalAuditsPerformed);

    if (state.honks < costHonks || state.funding < costFunding) return state;

    const nextState = {
        ...state,
        honks: state.honks - costHonks,
        funding: state.funding - costFunding,
        totalUpgradesPurchased: 0, // RESET FRICTION
        totalAuditsPerformed: state.totalAuditsPerformed + 1,
    };

    nextState.honksPerSecond = calculateRates(nextState);
    return nextState;
}
