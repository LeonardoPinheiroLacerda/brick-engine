import { Debuggable } from '../../types/Interfaces';
import { Score } from '../../types/modules';
import { Serializable } from '../../types/Interfaces';
import { ScoreProperty } from '../../types/enums';
import EventEmitter from '../../event/EventEmitter';

/**
 * Stateful module dedicated to tracking real-time player performance metrics.
 *
 * Implements the {@link Score} and {@link Serializable} interfaces to provide
 * a centralized authority for maintaining score lines, difficulty levels, and
 * multiplier bonuses. It uniquely tracks the global `highScore` by saving it
 * directly to `LocalStorage` under an isolated `gameId` namespace.
 */
export default class GameScore implements Score, Debuggable, Serializable {
    private _score: number = 0;
    private _multiplier: number = 1;
    private _level: number = 1;
    private _maxLevel: number = 10;
    private _highScore: number = 0;

    private _gameId: string = 'unknown';

    serialId: string = 'score';

    /**
     * Initializes the High Score context using a distinct installation prefix.
     *
     * @param {string} id - The explicit game UUID or namespace string to prevent record collisions.
     * @returns {void} Returns nothing.
     */
    setupGameHighScore(id: string): void {
        this._gameId = id;
        this._highScore = Number(localStorage.getItem(`${this._gameId}::highScore`));
    }

    /**
     * Increases the score by the given base amount after calculating active multipliers.
     * Automatically assesses if the new score surpasses and replaces the persistent High Score.
     *
     * @param {number} amount - The integer base points to add before multipliers.
     * @returns {void} Returns nothing.
     */
    increaseScore(amount: number): void {
        this._score += amount * this._multiplier;
        this._notify(ScoreProperty.SCORE);

        if (this._score > this._highScore) {
            this.highScore = this._score;
        }
    }

    /**
     * Zeroes out the active tracking score.
     *
     * @returns {void} Returns nothing.
     */
    resetScore(): void {
        this._score = 0;
        this._notify(ScoreProperty.SCORE);
    }

    /**
     * Exports the raw session score as a physically padded string sequence.
     *
     * @param {number} [digits=6] - The optional total number of sequence places to output (e.g. 6).
     * @returns {string} The formatted string payload displaying leading zeros (e.g., "000150").
     */
    getFormattedScore(digits: number = 6): string {
        return this._score.toString().padStart(digits, '0');
    }

    /**
     * Steps up the active engine difficulty level scaling.
     *
     * @param {number} amount - The integer step of new levels to jump.
     * @returns {void} Returns nothing.
     */
    increaseLevel(amount: number): void {
        this._level += amount;
        this._notify(ScoreProperty.LEVEL);
    }

    /**
     * Resets the active difficulty level baseline back to initial 1.
     *
     * @returns {void} Returns nothing.
     */
    resetLevel(): void {
        this._level = 1;
        this._notify(ScoreProperty.LEVEL);
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
        if (this._multiplier !== value) {
            this._multiplier = value;
            this._notify(ScoreProperty.MULTIPLIER);
        }
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
        if (this._maxLevel !== value) {
            this._maxLevel = value;
            this._notify(ScoreProperty.MAX_LEVEL);
        }
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
        if (this._highScore !== value) {
            this._highScore = value;
            localStorage.setItem(`${this._gameId}::highScore`, value.toString());
            this._notify(ScoreProperty.HIGH_SCORE);
        }
    }

    /**
     * Subscribes a callback for a specific score property.
     *
     * @param {ScoreProperty} property - The property to subscribe to.
     * @param {function(number): void} callback - The function to execute when the score changes.
     * @returns {void} Returns nothing.
     */
    subscribe(property: ScoreProperty, callback: (score: number) => void): void {
        EventEmitter.subscribe(property, callback);
    }

    /**
     * Unsubscribes a callback from a specific score property.
     *
     * @param {ScoreProperty} property - The property to unsubscribe from.
     * @param {function(number): void} callback - The callback reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribe(property: ScoreProperty, callback: (score: number) => void): void {
        EventEmitter.unsubscribe(property, callback);
    }

    /**
     * Notifies all subscribers of a property change via the {@link EventEmitter}.
     *
     * @param {ScoreProperty} property - The property enum string that dictates the notification channel.
     * @returns {void} Returns nothing.
     */
    private _notify(property: ScoreProperty): void {
        const value = this[property as keyof GameScore] as number;
        EventEmitter.notify(property, value);
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
     * Modifies the running variables based on an injected serialized payload.
     * Instructed dynamically by the `SessionManager` during initialization recovery.
     *
     * @param {string} data - The packed string blob enclosing the structured saved session.
     * @returns {void} Returns nothing.
     */
    deserialize(data: string): void {
        const parsed = JSON.parse(data);
        this._score = parsed.score;
        this._multiplier = parsed.multiplier;
        this._level = parsed.level;
        this._maxLevel = parsed.max_level;
    }
}
