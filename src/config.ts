export interface UpgradeConfig {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    costScaling: 'linear' | 'exponential';
    costFactor: number; // Additive for linear, Multiplier for exponential
    effectType: 'add' | 'multiply';
    effectValue: number;
    reqUnlockId?: string;
    collegeId?: string; // Associated college
    costType?: 'honks' | 'researchData' | 'navigationMaps' | 'sportsTrophies' | 'culturalAntiques';
}

export interface UnlockConfig {
    id: string;
    name: string;
    threshold: number;
    multiplier: number;
    costumeId?: string;
}

export interface RivalConfig {
    id: string;
    name: string;
    basePower: number;
    rewardReputation: number;
    rewardHonks: number;
    tacticalType: 'Aggressive' | 'Intellectual' | 'Adaptive' | 'Creative' | 'Balanced';
    isBoss?: boolean;
}

export interface RegionConfig {
    id: string;
    name: string;
    description: string;
    unlockReputation: number;
    rivalIds: string[];
    bossId: string;
    multiplier: number;
}

export interface CollegeConfig {
    id: string;
    name: string;
    description: string;
    primaryStat: 'honk_bonus' | 'multiplier_bonus' | 'cooldown_reduction' | 'power_bonus' | 'reputation_bonus';
    tacticalType: 'Aggressive' | 'Intellectual' | 'Adaptive' | 'Creative' | 'Balanced';
}

export interface LegacyUpgradeConfig {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    effectType: 'honk_mult' | 'power_mult' | 'student_mult' | 'funding_mult';
    effectValue: number; // Increment per level
}

export const GAME_CONFIG = {
    INITIAL_HONKS_PER_SECOND: 1,
    AUTOSAVE_INTERVAL_MS: 10000,
    BATTLE_COOLDOWN_MS: 30000,
    STUDENTS_PER_HONK_SEC: 0.01, // 0.1 -> 0.01 (Hard Mode)
    FUNDING_PER_STUDENT_SEC: 0.001, // 0.01 -> 0.001 (Hard Mode)
    ASCENSION_THRESHOLD: 10000000, // 10M instead of 1M (Hard Mode)
    GOLDEN_FEATHERS_PER_1M_HONKS: 0.1, // 1 feather per 10M (Hard Mode)

    // Hard Mode Extras
    RIVAL_SCALING_PER_VICTORY: 1.05,
    FRICTION_PER_10_UPGRADES: 0.01,
    AUDIT_BASE_COST_HONKS: 1000000,
    AUDIT_BASE_COST_FUNDING: 5000,
    LEGACY_UPGRADES: [
        {
            id: 'golden_resonance',
            name: 'Golden Resonance',
            description: 'Permanently increases Honk rate by 10% per level.',
            baseCost: 1,
            effectType: 'honk_mult',
            effectValue: 0.1,
        },
        {
            id: 'avian_diplomacy',
            name: 'Avian Diplomacy',
            description: 'Permanently increases Battle Power by 20% per level.',
            baseCost: 2,
            effectType: 'power_mult',
            effectValue: 0.2,
        },
        {
            id: 'recruitment_drive',
            name: 'Recruitment Drive',
            description: 'Increases student enrollment speed by 25% per level.',
            baseCost: 3,
            effectType: 'student_mult',
            effectValue: 0.25,
        },
    ] as LegacyUpgradeConfig[],
    COLLEGES: {
        'college_of_honkery': {
            id: 'college_of_honkery',
            name: 'College of Honkery',
            description: 'The foundation of all honking. Increases base honk output.',
            primaryStat: 'honk_bonus',
            tacticalType: 'Balanced',
        },
        'division_of_feathered_sciences': {
            id: 'division_of_feathered_sciences',
            name: 'Division of Feathered Sciences',
            description: 'Experimental honk resonance. Increases all multipliers.',
            primaryStat: 'multiplier_bonus',
            tacticalType: 'Intellectual',
        },
        'dept_migratory_studies': {
            id: 'dept_migratory_studies',
            name: 'Dept. of Migratory Studies',
            description: 'Efficient movement. Reduces battle cooldowns.',
            primaryStat: 'cooldown_reduction',
            tacticalType: 'Adaptive',
        },
        'athletic_department': {
            id: 'athletic_department',
            name: 'Athletic Department',
            description: 'Physical excellence. Provides a direct bonus to battle power.',
            primaryStat: 'power_bonus',
            tacticalType: 'Aggressive',
        },
        'school_avian_arts': {
            id: 'school_avian_arts',
            name: 'School of Avian Arts',
            description: 'Performative honking. Increases reputation gains from victory.',
            primaryStat: 'reputation_bonus',
            tacticalType: 'Creative',
        },
    } as Record<string, CollegeConfig>,
    RIVALS: [
        // Region 1
        { id: 'pond_tech', name: 'Pond Tech', basePower: 10, rewardReputation: 1, rewardHonks: 100, tacticalType: 'Adaptive' },
        { id: 'river_state', name: 'River State', basePower: 50, rewardReputation: 5, rewardHonks: 500, tacticalType: 'Aggressive' },
        { id: 'swan_king', name: 'The Swan King', basePower: 200, rewardReputation: 25, rewardHonks: 2500, tacticalType: 'Balanced', isBoss: true },

        // Region 2
        { id: 'maple_inst', name: 'Maple Institute', basePower: 500, rewardReputation: 50, rewardHonks: 10000, tacticalType: 'Creative' },
        { id: 'northern_u', name: 'Northern U', basePower: 2000, rewardReputation: 100, rewardHonks: 50000, tacticalType: 'Intellectual' },
        { id: 'dean_mallard', name: 'Dean Mallard', basePower: 10000, rewardReputation: 500, rewardHonks: 250000, tacticalType: 'Balanced', isBoss: true },

        // Region 3
        { id: 'lakeside', name: 'Lakeside College', basePower: 50000, rewardReputation: 1000, rewardHonks: 1000000, tacticalType: 'Adaptive' },
        { id: 'oceanic_state', name: 'Oceanic State', basePower: 250000, rewardReputation: 2500, rewardHonks: 5000000, tacticalType: 'Aggressive' },
        { id: 'great_goose', name: 'The Great Goose', basePower: 1000000, rewardReputation: 10000, rewardHonks: 25000000, tacticalType: 'Balanced', isBoss: true },
    ] as RivalConfig[],
    REGIONS: [
        {
            id: 'local_ponds',
            name: 'Local Ponds',
            description: 'Where every goose begins their journey.',
            unlockReputation: 0,
            rivalIds: ['pond_tech', 'river_state'],
            bossId: 'swan_king',
            multiplier: 1,
        },
        {
            id: 'academic_city',
            name: 'Academic City',
            description: 'The urban jungle of elite avian scholars.',
            unlockReputation: 50,
            rivalIds: ['maple_inst', 'northern_u'],
            bossId: 'dean_mallard',
            multiplier: 2,
        },
        {
            id: 'global_stage',
            name: 'Global Stage',
            description: 'The highest peak of university recognition.',
            unlockReputation: 1000,
            rivalIds: ['lakeside', 'oceanic_state'],
            bossId: 'great_goose',
            multiplier: 5,
        },
    ] as RegionConfig[],
    UNLOCKS: {
        COLLEGE: {
            id: 'college_of_honkery',
            name: 'College of Honkery',
            threshold: 500, // Was 50
            multiplier: 1.01, // Was 1.25 (Hard Mode: 1%)
        },
        DIVISION: {
            id: 'division_of_feathered_sciences',
            name: 'Division of Feathered Sciences',
            threshold: 100000, // Was 2500 (Hard Mode: 40x)
            multiplier: 1.01, // Was 1.5 (Hard Mode: 1%)
            costumeId: 'scientist',
        },
        ATHLETICS: {
            id: 'dept_athletic_excellence',
            name: 'Athletic Excellence',
            threshold: 500000, // Was 7500 (Hard Mode: Significant jump)
            multiplier: 1.01, // Was 1.75 (Hard Mode: 1%)
            costumeId: 'athlete',
        }
    } as Record<string, UnlockConfig>,
    UPGRADES: [
        {
            id: 'better_goose',
            name: 'Better Goose',
            description: 'Increases honks per second by 1.',
            baseCost: 25,
            costScaling: 'linear',
            costFactor: 5,
            effectType: 'add',
            effectValue: 1,
        },
        // Sciences Equipment
        {
            id: 'high_res_microscopes',
            name: 'High-Res Microscopes',
            description: 'Adds +5 power to Sciences.',
            baseCost: 10,
            costScaling: 'exponential',
            costFactor: 1.8,
            effectType: 'add',
            effectValue: 5,
            reqUnlockId: 'division_of_feathered_sciences',
            collegeId: 'division_of_feathered_sciences',
            costType: 'researchData',
        },
        {
            id: 'resonance_chambers',
            name: 'Resonance Chambers',
            description: 'Adds +25 power to Sciences.',
            baseCost: 50,
            costScaling: 'exponential',
            costFactor: 2.2,
            effectType: 'add',
            effectValue: 25,
            reqUnlockId: 'division_of_feathered_sciences',
            collegeId: 'division_of_feathered_sciences',
            costType: 'researchData',
        },
        // Migratory Equipment
        {
            id: 'star_charts',
            name: 'Star Charts',
            description: 'Adds +10 power to Migratory.',
            baseCost: 10,
            costScaling: 'exponential',
            costFactor: 1.8,
            effectType: 'add',
            effectValue: 10,
            reqUnlockId: 'division_of_feathered_sciences',
            collegeId: 'dept_migratory_studies',
            costType: 'navigationMaps',
        },
        // Athletics Equipment
        {
            id: 'premium_birdseed',
            name: 'Premium Birdseed',
            description: 'Adds +20 power to Athletics.',
            baseCost: 10,
            costScaling: 'exponential',
            costFactor: 1.8,
            effectType: 'add',
            effectValue: 20,
            reqUnlockId: 'division_of_feathered_sciences',
            collegeId: 'athletic_department',
            costType: 'sportsTrophies',
        },
        // Arts Equipment
        {
            id: 'gilded_quills',
            name: 'Gilded Quills',
            description: 'Adds +15 power to Arts.',
            baseCost: 10,
            costScaling: 'exponential',
            costFactor: 1.8,
            effectType: 'add',
            effectValue: 15,
            reqUnlockId: 'division_of_feathered_sciences',
            collegeId: 'school_avian_arts',
            costType: 'culturalAntiques',
        },
        {
            id: 'research_lab',
            name: 'Research Lab',
            description: 'Adds +5 Honks/sec. Requires College.',
            baseCost: 500,
            costScaling: 'linear',
            costFactor: 50,
            effectType: 'add',
            effectValue: 5,
            reqUnlockId: 'college_of_honkery',
        }
    ] as UpgradeConfig[],
    TACTICAL_BONUSES: {
        'Aggressive': 'Intellectual',
        'Intellectual': 'Adaptive',
        'Adaptive': 'Creative',
        'Creative': 'Aggressive',
    } as Record<string, string>,
    TACTICAL_MULTIPLIER: 1.5,
};
