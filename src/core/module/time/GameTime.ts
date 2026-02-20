import { Debuggable } from '../../types/Interfaces';
import { Time } from '../../types/modules';
import { Serializable } from '../../../types/interfaces';

/**
 * Manages game time, frame rates, and tick intervals.
 * Handles the game loop timing and debug statistics (FPS, TPS).
 */
export default class GameTime implements Time, Debuggable, Serializable {
    // Time accumulator
    protected _accumulatedTime: number = 0;
    protected _tickInterval: number;
    protected _fps: number = 0;
    protected _tps: number = 0;
    protected _tickCounter: number = 0;
    protected _timeSinceLastTpsUpdate: number = 0;

    serialId: string = 'time';

    /**
     * Creates an instance of GameTime.
     *
     * @param {number} tickInterval - The target interval between game ticks in milliseconds.
     */
    constructor(tickInterval: number) {
        this._tickInterval = tickInterval;
    }

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
        this._accumulatedTime += deltaTime;
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
        if (this._accumulatedTime >= this._tickInterval) {
            this._accumulatedTime -= this._tickInterval;
            this._tickCounter++;
            return true;
        }
        return false;
    }

    /**
     * Resets the time accumulator and debug counters.
     */
    reset() {
        this._accumulatedTime = 0;
        this._fps = 0;
        this._tps = 0;
        this._tickCounter = 0;
        this._timeSinceLastTpsUpdate = 0;
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
        const newInterval = Math.max(10, this._tickInterval - amount);
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
            accumulated_time: this._accumulatedTime.toFixed(2),
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
}
