import GameGrid from './GameGrid';

/**
 * A specialized grid implementation for the Heads-Up Display (HUD).
 * Typically used for previewing the "next piece" in Tetris-like games.
 * It has fixed dimensions (usually 4x4).
 */
export default class GameHudGrid extends GameGrid {
    /**
     * The fixed width of the HUD grid.
     *
     * @returns {number} Always returns 4.
     */
    get width(): number {
        return 4;
    }

    /**
     * The fixed height of the HUD grid.
     *
     * @returns {number} Always returns 4.
     */
    get height(): number {
        return 4;
    }
}
