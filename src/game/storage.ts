import { type GameState, INITIAL_STATE } from './types';
import { tick } from './engine';

const STORAGE_KEY = 'goose_university_save';

export function saveGame(state: GameState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);

            const migratedState: GameState = {
                ...INITIAL_STATE,
                ...parsed,
                upgrades: parsed.upgrades || {},
                unlocks: parsed.unlocks || {},
                totalHonksEarned: parsed.totalHonksEarned ?? parsed.honks ?? 0,
                timePlayedSeconds: parsed.timePlayedSeconds || 0,
                unlockedCostumes: parsed.unlockedCostumes || ['default'],
                selectedCostume: parsed.selectedCostume || 'default',
                reputation: parsed.reputation || 0,
                battleState: parsed.battleState || { level: 1, cooldown: 0 },
                goldenFeathers: parsed.goldenFeathers || 0,
                students: parsed.students || 0,
                funding: parsed.funding || 0,
                legacyUpgrades: parsed.legacyUpgrades || {},
            };

            // Mission 2 Migration: Convert boolean upgrades to number
            // We iterate over the loaded upgrades. If any value is boolean 'true', convert to 1.
            for (const [key, value] of Object.entries(migratedState.upgrades)) {
                if ((value as any) === true) {
                    migratedState.upgrades[key] = 1;
                } else if (typeof value !== 'number') {
                    // Safety fallback
                    migratedState.upgrades[key] = 0;
                }
            }

            const now = Date.now();
            const lastTime = migratedState.lastSaveTime || now;
            const elapsed = now - lastTime;

            if (elapsed > 0) {
                return tick(migratedState, elapsed);
            }
            return migratedState;
        } catch (e) {
            console.error("Failed to load save:", e);
            return INITIAL_STATE;
        }
    }
    return INITIAL_STATE;
}

export function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_STATE;
}
