import P5 from 'p5';
import { Time } from '../../types/modules';

/**
 * Manages game time and tick intervals.
 */
export default class GameTime implements Time {
    // Time accumulator
    protected _accumulatedTime: number = 0;
    protected _tickInterval: number;

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
    }

    /**
     * Checks if enough time has passed for a game tick.
     * @returns True if a tick should occur.
     */
    shouldTick(): boolean {
        if (this._accumulatedTime >= this._tickInterval) {
            this._accumulatedTime -= this._tickInterval;
            return true;
        }
        return false;
    }

    /**
     * Resets the time accumulator.
     */
    reset() {
        this._accumulatedTime = 0;
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

    /**
     * Renders performance information overlay.
     * @param p The P5 instance to render with.
     */
    renderPerformance(p: P5) {
        // No-op in base implementation
    }
}
