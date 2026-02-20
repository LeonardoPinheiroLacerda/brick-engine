import { Debuggable } from '../../types/Interfaces';
import { Score } from '../../types/modules';
import { Serializable } from '../../../types/interfaces';

/**
 * Manages game scoring, levels, and high score tracking.
 * Acts as the authority for the game's `highScore`, persisting it directly to `LocalStorage`.
 * Handles multipliers and supports Session serialization out of the box.
 */
export default class GameScore implements Score, Debuggable, Serializable {
    private _score: number = 0;
    private _multiplier: number = 1;
    private _level: number = 1;
    private _maxLevel: number = 10;
    private _highScore: number = 0;

    serialId: string = 'score';

    /**
     * Initializes the score module.
     * Currently a no-op but required by interface.
     */
    setup(): void {
        this._highScore = Number(localStorage.getItem('highScore'));
    }

    /**
     * Increases the score by the given amount, applying the current multiplier.
     * Automatically checks for high score updates.
     *
     * @param {number} amount - The base amount to increase by.
     */
    increaseScore(amount: number): void {
        this._score += amount * this._multiplier;
        if (this._score > this._highScore) {
            this.highScore = this._score;
        }
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
     * Gets the current high score.
     *
     * @returns {number} The current high score.
     */
    get highScore(): number {
        return this._highScore;
    }

    /**
     * Sets the high score.
     *
     * @param {number} value - The new high score.
     */
    set highScore(value: number) {
        this._highScore = value;
        localStorage.setItem('highScore', value.toString());
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

    /**
     * Serializes the current score and level progress into a JSON string.
     * This is used by the SessionManager to save transient state.
     *
     * @returns {string} The serialized JSON data.
     */
    serialize(): string {
        return JSON.stringify({
            score: this._score,
            multiplier: this._multiplier,
            level: this._level,
            max_level: this._maxLevel,
        });
    }

    /**
     * Restores score and level progress from a serialized JSON string.
     * Used by the SessionManager when recovering an active session.
     *
     * @param {string} data - The JSON string containing the saved session data.
     */
    deserialize(data: string): void {
        const parsed = JSON.parse(data);
        this._score = parsed.score;
        this._multiplier = parsed.multiplier;
        this._level = parsed.level;
        this._maxLevel = parsed.max_level;
    }
}
