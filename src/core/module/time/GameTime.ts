import { Debuggable } from '../../types/Interfaces';
import { Time } from '../../types/modules';
import { Serializable } from '../../types/Interfaces';
import configs from '../../../config/configs';

/**
 * Orchestrates the engine's logical clock and performance metrics.
 *
 * Designed to decouple deterministic game logic "ticks" from the unpredictable
 * visual frame rate of the browser. By maintaining an internal time accumulator,
 * it ensures that gameplay events (like physics, timers, and difficulty scaling)
 * execute at a consistent speed regardless of the host device's hardware
 * performance or FPS fluctuations.
 *
 * Implements the {@link Time} interface to provide a standardized timing
 * contract for all engine modules.
 */
export default class GameTime implements Time, Debuggable, Serializable {
    // Time accumulator
    protected _tickAccumulator: number = 0;
    /** The tick interval at the start of the game session. Used for resets. */
    private _initialTickInterval: number = configs.game.tickInterval;
    private _tickInterval: number = configs.game.tickInterval;
    private _fps: number = 0;
    private _tps: number = 0;
    private _tickCounter: number = 0;
    private _totalTicks: number = 0;
    private _timeSinceLastTpsUpdate: number = 0;
    private _totalElapsedTime: number = 0;

    serialId: string = 'time';

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
     * Initializes the time module's core state.
     *
     * Resets all internal timers and statistical accumulators to their
     * baseline values, ensuring a clean state for a new game session.
     *
     * @returns {void}
     */
    setup(): void {
        this.reset();
    }

    /**
     * Updates the physical performance metrics.
     *
     * Calculates the current Frames Per Second (FPS) and updates the Ticks
     * Per Second (TPS) statistics. This method should be called exactly
     * once per visual frame in the main loop.
     *
     * @param {number} deltaTime - The physical time physically elapsed since the last rendering frame in milliseconds.
     * @returns {void}
     */
    update(deltaTime: number) {
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
     * Adds elapsed time to the simulation accumulator.
     *
     * This time is used to determine when the next logical tick should
     * be processed. It allows the engine to "catch up" if the frame
     * rate drops below the target tick rate.
     *
     * @param {number} deltaTime - Time in milliseconds to add to the logic simulation.
     * @returns {void}
     */
    accumulate(deltaTime: number): void {
        this._tickAccumulator += deltaTime;
    }

    /**
     * Evaluates if the engine should execute a logical simulation tick.
     *
     * Checks if the accumulated time exceeds the required tick interval.
     * If so, it consumes all pending time in the accumulator and
     * increments the logical counters.
     *
     * @internal Used specifically by the engine's core orchestration loop.
     * @returns {boolean} `true` if at least one tick's worth of time was consumed.
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
     * Safely resets the time accumulator and all debug statistical counters.
     *
     * @returns {void} Returns nothing.
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
     * Checks if enough logical time has passed based on a specific millisecond interval.
     * Use for time-based triggers that need to be stable even if the frame rate varies.
     *
     * @param {number} ms - The millisecond interval to check.
     * @returns {boolean} True if the logical clock just crossed a multiple of the interval.
     */
    atInterval(ms: number): boolean {
        if (this._totalTicks === 0) return false;
        const currentWindow = Math.floor((this._totalTicks * this._tickInterval) / ms);
        const previousWindow = Math.floor(((this._totalTicks - 1) * this._tickInterval) / ms);
        return currentWindow > previousWindow;
    }

    /**
     * Executes a callback function every N milliseconds of logical game time.
     *
     * Provides a declarative functional approach to handling recurring game logic,
     * such as spawning enemies or updating timers.
     *
     * @param {number} ms - The millisecond interval between executions.
     * @param {() => void} action - The callback function to execute if the interval is crossed.
     * @returns {void}
     */
    every(ms: number, action: () => void): void {
        if (this.atInterval(ms)) {
            action();
        }
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
            elapsedTime: this._totalElapsedTime,
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
