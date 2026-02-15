import { StateSyncable } from '../../types/Interfaces';
import { Score, State } from '../../types/modules';

export default class GameScore implements Score, StateSyncable {
    private _score: number = 0;
    private _multiplier: number = 1;
    private _level: number = 1;
    private _maxLevel: number = 1;

    _state: State;

    /**
     * Sets the state module required for the Score context.
     * @param state The game state module.
     */
    setState(state: State): void {
        this._state = state;
    }

    /**
     * Sets up the module.
     */
    setup(): void {
        // No setup needed for now
    }

    /**
     * Increases the score by the given amount, applying the current multiplier.
     * @param amount The amount to increase by.
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
     * Helper to get score with leading zeros.
     * @param digits Number of digits (default 6).
     */
    getFormattedScore(digits: number = 6): string {
        return this._score.toString().padStart(digits, '0');
    }

    /**
     * Increases the game level.
     */
    increaseLevel(amount: number): void {
        this._level += amount;
    }

    /**
     * Resets the game level to 1.
     */
    resetLevel(): void {
        this._level = 1;
    }

    /**
     * Checks if the current score is higher than the high score and updates it if so.
     */
    private _checkHighScore(): void {
        if (!this._state) return;

        if (this._score > this._state.highScore) {
            this._state.highScore = this._score;
        }
    }

    get multiplier(): number {
        return this._multiplier;
    }

    set multiplier(value: number) {
        this._multiplier = value;
    }

    get level(): number {
        return this._level;
    }

    get score(): number {
        return this._score;
    }

    get maxLevel(): number {
        return this._maxLevel;
    }

    set maxLevel(value: number) {
        this._maxLevel = value;
    }

    syncState(state: State): void {
        this._state = state;
    }
}
