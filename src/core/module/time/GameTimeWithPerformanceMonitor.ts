import P5 from 'p5';
import GameTime from './GameTime';
import TimePerformanceMonitor from './TimePerformanceMonitor';

/**
 * Manages game time and tick intervals, with performance overlay capabilities.
 */
export default class GameTimeWithPerformanceMonitor extends GameTime {
    private _performance: TimePerformanceMonitor;

    constructor(tickInterval: number) {
        super(tickInterval);
        this._performance = new TimePerformanceMonitor(tickInterval);
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
        const tick = super.shouldTick();
        if (tick) {
            this._performance.logTick();
        }
        return tick;
    }

    /**
     * Renders performance information overlay.
     * @param p The P5 instance to render with.
     */
    renderPerformanceMonitor(p: P5) {
        this._performance.render(p, this.tickInterval);
    }
}
