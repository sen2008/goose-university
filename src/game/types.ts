export interface GameState {
    honks: number;
    totalHonksEarned: number;
    honksPerSecond: number;
    lastSaveTime: number; // Timestamp
    timePlayedSeconds: number;
    upgrades: Record<string, number>; // id -> level
    unlocks: Record<string, boolean>; // id -> unlocked
    unlockedCostumes: string[];
    selectedCostume: string;
    reputation: number;
    battleState: {
        level: number;
        cooldown: number;
        lastResult?: string;
    };
    colleges: Record<string, { level: number; experience: number }>;
    selectedCollegeIds: string[];
    // Expansion Phase
    goldenFeathers: number;
    students: number;
    funding: number;
    legacyUpgrades: Record<string, number>; // id -> level (permanent)
    currentRegionId: string;
    defeatedBosses: string[];
    rivalPowerMultipliers: Record<string, number>; // Dynamic scaling
    totalUpgradesPurchased: number; // For friction
    totalAuditsPerformed: number; // For audit scaling
    collegeResources: Record<string, number>; // collegeId -> amount
}

export const INITIAL_STATE: GameState = {
    honks: 0,
    totalHonksEarned: 0,
    honksPerSecond: 1,
    lastSaveTime: Date.now(),
    timePlayedSeconds: 0,
    upgrades: {},
    unlocks: {},
    unlockedCostumes: ['default'],
    selectedCostume: 'default',
    reputation: 0,
    battleState: {
        level: 1,
        cooldown: 0,
    },
    colleges: {
        'college_of_honkery': { level: 1, experience: 0 },
        'division_of_feathered_sciences': { level: 1, experience: 0 },
        'dept_migratory_studies': { level: 1, experience: 0 },
        'athletic_department': { level: 1, experience: 0 },
        'school_avian_arts': { level: 1, experience: 0 },
    },
    selectedCollegeIds: ['college_of_honkery'],
    goldenFeathers: 0,
    students: 0,
    funding: 0,
    legacyUpgrades: {},
    currentRegionId: 'local_ponds',
    defeatedBosses: [],
    rivalPowerMultipliers: {},
    totalUpgradesPurchased: 0,
    totalAuditsPerformed: 0,
    collegeResources: {
        'division_of_feathered_sciences': 0,
        'dept_migratory_studies': 0,
        'athletic_department': 0,
        'school_avian_arts': 0,
    },
};
