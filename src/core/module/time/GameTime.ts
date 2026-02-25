import { Debuggable } from '../../types/Interfaces';
import { Time } from '../../types/modules';
import { Serializable } from '../../types/Interfaces';
import configs from '../../../config/configs';

/**
 * Manages game time, frame rates, and tick intervals.
 * Handles the game loop timing and debug statistics (FPS, TPS).
 */
export default class GameTime implements Time, Debuggable, Serializable {
    // Time accumulator
    protected _tickAccumulator: number = 0;
    /** The tick interval at the start of the game session. Used for resets. */
    private _initialTickInterval: number = configs.game.tickInterval;
    private _minTickInterval: number = configs.game.minTickInterval;
    private _tickInterval: number = configs.game.tickInterval;
    private _fps: number = 0;
    private _tps: number = 0;
    private _tickCounter: number = 0;
    private _totalTicks: number = 0;
    private _timeSinceLastTpsUpdate: number = 0;
    private _totalElapsedTime: number = 0;

    serialId: string = 'time';

    /**
     * Initializes the time module.
     * Resets all timers and counters.
     */
    setup(): void {
        this.reset();
    }

    /**
     * Updates the time accumulator and calculates FPS/TPS.
     * Should be called once per frame.
     *
     * @param {number} deltaTime - Time elapsed since last frame in milliseconds.
     */
    update(deltaTime: number) {
        this._tickAccumulator += deltaTime;
        this._totalElapsedTime += deltaTime;
        this._fps = 1000 / deltaTime;

        this._timeSinceLastTpsUpdate += deltaTime;
        if (this._timeSinceLastTpsUpdate >= 1000) {
            this._tps = this._tickCounter;
            this._tickCounter = 0;
            this._timeSinceLastTpsUpdate -= 1000;
        }
    }

    /**
     * Checks if enough time has passed for a game tick.
     * Consumes accumulated time if a tick occurs.
     *
     * @returns {boolean} True if a tick should occur.
     */
    shouldTick(): boolean {
        if (this._tickAccumulator >= this._tickInterval) {
            this._tickAccumulator -= this._tickInterval;
            this._tickCounter++;
            this._totalTicks++;
            return true;
        }
        return false;
    }

    /**
     * Resets the time accumulator and debug counters.
     */
    reset() {
        this._tickAccumulator = 0;
        this._fps = 0;
        this._tps = 0;
        this._tickCounter = 0;
        this._totalTicks = 0;
        this._timeSinceLastTpsUpdate = 0;
        this._totalElapsedTime = 0;
        this._tickInterval = this._initialTickInterval;
    }

    /**
     * Gets the current tick interval.
     *
     * @returns {number} The tick interval in milliseconds.
     */
    get tickInterval(): number {
        return this._tickInterval;
    }

    /**
     * Sets the tick interval and resets timing.
     *
     * @param {number} interval - The new tick interval in milliseconds.
     */
    set tickInterval(interval: number) {
        this._tickInterval = interval;
        // this.reset(); // Removed reset to prevent stuttering on speed change
    }

    /**
     * Increments the tick interval (slowing down the game).
     *
     * @param {number} amount - The amount to add to the interval.
     */
    incrementTickInterval(amount: number) {
        this.tickInterval = this._tickInterval + amount;
    }

    /**
     * Decrements the tick interval (speeding up the game).
     * Enforces a minimum interval of 10ms.
     *
     * @param {number} amount - The amount to subtract from the interval.
     */
    decrementTickInterval(amount: number) {
        const newInterval = Math.max(this._minTickInterval, this._tickInterval - amount);
        this.tickInterval = newInterval;
    }

    /**
     * Retrieves debug information about the time system.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            fps: Math.round(this._fps),
            tps: this._tps,
            tick_interval: this._tickInterval.toFixed(2),
            tick_accumulator: this._tickAccumulator.toFixed(2),
        };
    }

    serialize(): string {
        return JSON.stringify({
            tickInterval: this._tickInterval,
        });
    }
    deserialize(data: string): void {
        const parsed = JSON.parse(data);
        this._tickInterval = parsed.tickInterval;
    }
    setTickInterval(interval: number): void {
        this._tickInterval = interval;
    }
    setMinTickInterval(interval: number): void {
        this._minTickInterval = interval;
    }

    /**
     * Gets the total number of ticks since the game started.
     *
     * @returns {number} Total tick count.
     */
    get totalTicks(): number {
        return this._totalTicks;
    }

    /**
     * Gets the total elapsed time in milliseconds.
     *
     * @returns {number} Elapsed time in ms.
     */
    get elapsedTime(): number {
        return this._totalElapsedTime;
    }

    /**
     * Checks if the current total tick count is a multiple of the provided interval.
     *
     * @param {number} interval - The tick interval to check.
     * @returns {boolean} True if the current tick is a multiple of the interval.
     */
    isTickEvery(interval: number): boolean {
        return this._totalTicks > 0 && this._totalTicks % interval === 0;
    }

    /**
     * Captures the current tick interval as the initial state.
     * This is useful for restoring the game speed on reset.
     */
    captureInitialState(): void {
        this._initialTickInterval = this._tickInterval;
    }
}
