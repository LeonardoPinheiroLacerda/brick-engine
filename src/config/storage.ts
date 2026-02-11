/**
 * Keys used for persisting data in LocalStorage.
 */
export const STORAGE = {
    /** Key for audio muting preference. */
    MUTED: 'MUTED',
    /** Key for color mode preference. */
    COLOR_ENABLED: 'COLOR_ENABLED',

    /** Key for the current game grid state. */
    GRID: 'GRID',
    /** Key for the current HUD grid state. */
    HUD_GRID: 'HUD_GRID',
    /** Key for the game speed/tick interval. */
    TICK_INTERVAL: 'TICK_INTERVAL',
    /** Key for the user's high score. */
    SCORE: 'SCORE',
} as const;
