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
}

export const GAME_CONFIG = {
    INITIAL_HONKS_PER_SECOND: 1,
    AUTOSAVE_INTERVAL_MS: 10000,
    UNLOCKS: {
        COLLEGE: {
            id: 'college_of_honkery',
            name: 'College of Honkery',
            threshold: 500,
            multiplier: 1.25,
        },
        DIVISION: {
            id: 'division_of_feathered_sciences',
            name: 'Division of Feathered Sciences',
            threshold: 2500,
            multiplier: 1.5,
        },
    },
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
        {
            id: 'goose_trainer',
            name: 'Goose Trainer',
            description: 'Multiplies global Honk rate by 1.1.',
            baseCost: 100,
            costScaling: 'exponential',
            costFactor: 1.5,
            effectType: 'multiply',
            effectValue: 1.1,
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
        },
        {
            id: 'dept_aerodynamics',
            name: 'Dept. of Aerodynamics',
            description: 'Optimizes flight paths. x1.5 Rate.',
            baseCost: 5000,
            costScaling: 'exponential',
            costFactor: 2.0,
            effectType: 'multiply',
            effectValue: 1.5,
            reqUnlockId: 'division_of_feathered_sciences',
        },
        {
            id: 'dept_honkology',
            name: 'Dept. of Honkology',
            description: 'Advanced vocal studies. x2.0 Rate.',
            baseCost: 10000,
            costScaling: 'exponential',
            costFactor: 2.5,
            effectType: 'multiply',
            effectValue: 2.0,
            reqUnlockId: 'division_of_feathered_sciences',
        },
        {
            id: 'dept_migratory',
            name: 'Dept. of Migratory Studies',
            description: 'Global reach. x2.5 Rate.',
            baseCost: 25000,
            costScaling: 'exponential',
            costFactor: 3.0,
            effectType: 'multiply',
            effectValue: 2.5,
            reqUnlockId: 'division_of_feathered_sciences',
        },
    ] as UpgradeConfig[],
};
