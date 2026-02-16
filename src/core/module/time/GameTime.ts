import { Debuggable } from '../../types/Interfaces';
import { Time } from '../../types/modules';

/**
 * Manages game time and tick intervals.
 */
export default class GameTime implements Time, Debuggable {
    // Time accumulator
    protected _accumulatedTime: number = 0;
    protected _tickInterval: number;
    protected _fps: number = 0;
    protected _tps: number = 0;
    protected _tickCounter: number = 0;
    protected _timeSinceLastTpsUpdate: number = 0;

    constructor(tickInterval: number) {
        this._tickInterval = tickInterval;
    }

    setup(): void {
        this.reset();
    }

    /**
     * Updates the time accumulator.
     * @param deltaTime Time elapsed since last frame in milliseconds.
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
     * @returns True if a tick should occur.
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
     * Resets the time accumulator.
     */
    reset() {
        this._accumulatedTime = 0;
        this._fps = 0;
        this._tps = 0;
        this._tickCounter = 0;
        this._timeSinceLastTpsUpdate = 0;
    }

    /**
     * Gets the tick interval.
     */
    get tickInterval(): number {
        return this._tickInterval;
    }

    /**
     * Sets the tick interval.
     * @param interval The new tick interval in milliseconds.
     */
    set tickInterval(interval: number) {
        this._tickInterval = interval;
        this.reset();
    }

    /**
     * Increments the tick interval.
     * @param amount The amount to increment the tick interval by.
     */
    incrementTickInterval(amount: number) {
        this.tickInterval = this._tickInterval + amount;
    }

    /**
     * Decrements the tick interval.
     * @param amount The amount to decrement the tick interval by.
     */
    decrementTickInterval(amount: number) {
        const newInterval = Math.max(10, this._tickInterval - amount);
        this.tickInterval = newInterval;
    }

    getDebugData(): Record<string, string | number | boolean> {
        return {
            fps: Math.round(this._fps),
            tps: this._tps,
            tick_interval: this._tickInterval.toFixed(2),
            accumulated_time: this._accumulatedTime.toFixed(2),
        };
    }
}
