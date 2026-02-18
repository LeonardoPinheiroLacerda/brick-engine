import { Debuggable, StateSyncable } from '../../types/Interfaces';
import { Score, State } from '../../types/modules';

/**
 * Manages game scoring, levels, and high score tracking.
 * Handles multipliers and synchronizes high scores with the state module.
 */
export default class GameScore implements Score, StateSyncable, Debuggable {
    private _score: number = 0;
    private _multiplier: number = 1;
    private _level: number = 1;
    private _maxLevel: number = 10;

    _state: State;

    /**
     * Sets the state module explicitly.
     * Use {@link syncState} for automated injection.
     *
     * @param {State} state - The game state module.
     */
    setState(state: State): void {
        this._state = state;
    }

    /**
     * Initializes the score module.
     * Currently a no-op but required by interface.
     */
    setup(): void {
        // No setup needed for now
    }

    /**
     * Increases the score by the given amount, applying the current multiplier.
     * Automatically checks for high score updates.
     *
     * @param {number} amount - The base amount to increase by.
     */
    increaseScore(amount: number): void {
        this._score += amount * this._multiplier;
        this._checkHighScore();
    }

    /**
     * Resets the current score to 0.
     */
    resetScore(): void {
        this._score = 0;
    }

    /**
     * Formats the current score as a string with leading zeros.
     *
     * @param {number} [digits=6] - The total number of digits to display.
     * @returns {string} The formatted score string (e.g., "000150").
     */
    getFormattedScore(digits: number = 6): string {
        return this._score.toString().padStart(digits, '0');
    }

    /**
     * Increases the game level by a specific amount.
     *
     * @param {number} amount - The number of levels to add.
     */
    increaseLevel(amount: number): void {
        this._level += amount;
    }

    /**
     * Resets the game level back to 1.
     */
    resetLevel(): void {
        this._level = 1;
    }

    /**
     * Checks if the current score is higher than the known high score.
     * If so, updates the high score in the state manager.
     */
    private _checkHighScore(): void {
        if (!this._state) return;

        if (this._score > this._state.getHighScore()) {
            this._state.setHighScore(this._score);
        }
    }

    /**
     * Gets the current score multiplier.
     *
     * @returns {number} The active multiplier.
     */
    get multiplier(): number {
        return this._multiplier;
    }

    /**
     * Sets the score multiplier.
     *
     * @param {number} value - The new multiplier value.
     */
    set multiplier(value: number) {
        this._multiplier = value;
    }

    /**
     * Gets the current level.
     *
     * @returns {number} The current level.
     */
    get level(): number {
        return this._level;
    }

    /**
     * Gets the current raw score.
     *
     * @returns {number} The current score value.
     */
    get score(): number {
        return this._score;
    }

    /**
     * Gets the maximum achievable level (if defined).
     *
     * @returns {number} The max level.
     */
    get maxLevel(): number {
        return this._maxLevel;
    }

    /**
     * Sets the maximum game level.
     *
     * @param {number} value - The max level cap.
     */
    set maxLevel(value: number) {
        this._maxLevel = value;
    }

    /**
     * Receives the shared game state module for high score synchronization.
     *
     * @param {State} state - The game state module.
     */
    syncState(state: State): void {
        this._state = state;
    }

    /**
     * Retrieves debug information about the score status.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            score: this._score,
            multiplier: this._multiplier,
            level: this._level,
            max_level: this._maxLevel,
        };
    }
}
