import P5 from 'p5';
import GameTime from './GameTime';
import TimePerformance from './TimePerformance';

/**
 * Manages game time and tick intervals, with performance overlay capabilities.
 */
export default class GameTimeWithPerformance extends GameTime {
    private _performance: TimePerformance;

    constructor(tickInterval: number) {
        super(tickInterval);
        this._performance = new TimePerformance(1000 / tickInterval);
    }

    /**
     * Updates the time accumulator and performance logic.
     * @param deltaTime Time elapsed since last frame in milliseconds.
     */
    update(deltaTime: number) {
        super.update(deltaTime);
        this._performance.update(deltaTime);
    }

    /**
     * Checks if enough time has passed for a game tick and logs it for performance monitoring.
     * @returns True if a tick should occur.
     */
    shouldTick(): boolean {
        if (super.shouldTick()) {
            this._performance.logTick();
            return true;
        }
        return false;
    }

    /**
     * Renders performance information overlay.
     * @param p The P5 instance to render with.
     */
    renderPerformance(p: P5) {
        this._performance.render(p, this.tickInterval);
    }
}
