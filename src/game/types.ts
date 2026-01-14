export interface GameState {
    honks: number;
    totalHonksEarned: number;
    honksPerSecond: number;
    lastSaveTime: number; // Timestamp
    timePlayedSeconds: number;
    upgrades: Record<string, number>; // id -> level
    unlocks: Record<string, boolean>; // id -> unlocked
}

export const INITIAL_STATE: GameState = {
    honks: 0,
    totalHonksEarned: 0,
    honksPerSecond: 1, // Will be overwritten by config on load/init usually, but good fallback
    lastSaveTime: Date.now(),
    timePlayedSeconds: 0,
    upgrades: {},
    unlocks: {},
};
