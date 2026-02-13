import P5 from 'p5';
import { Time } from '../../types/modules';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';

/**
 * Manages game time and tick intervals.
 */
export default class GameTime implements Time {
    // Time accumulator
    private _accumulatedTime: number = 0;
    private _tickInterval: number;

    // Debug layout
    private _debugLayout: {
        canvasWidth: number;
        canvasHeight: number;
        box: { x: number; y: number; w: number; h: number };
        text: { size: number; padding: number; lineHeight: number };
    } | null = null;

    private _debugUpdateCounter: number = 0;
    private _cachedDebugInfo: { fps: string; tickRate: string; interval: string; delta: string } | null = null;

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
     * Renders debug information overlay.
     * @param p The P5 instance to render with.
     */
    renderDebug(p: P5) {
        if (this._debugUpdateCounter % 10 === 0 || !this._cachedDebugInfo) {
            this._cachedDebugInfo = {
                fps: p.frameRate().toFixed(0),
                tickRate: (1000 / this._tickInterval).toFixed(1),
                interval: this._tickInterval.toFixed(0),
                delta: p.deltaTime.toFixed(1),
            };
        }
        this._debugUpdateCounter++;

        // Lazy initialization or update on resize
        if (!this._debugLayout || this._debugLayout.canvasWidth !== p.width || this._debugLayout.canvasHeight !== p.height) {
            const boxWidth = RelativeValuesHelper.getRelativeWidth(p, 0.2929);
            const boxHeight = RelativeValuesHelper.getRelativeHeight(p, 0.165);
            const margin = RelativeValuesHelper.getRelativeWidth(p, 0.01969);
            const fontSize = RelativeValuesHelper.getRelativeHeight(p, 0.0234);

            this._debugLayout = {
                canvasWidth: p.width,
                canvasHeight: p.height,
                box: {
                    x: p.width - boxWidth - margin,
                    y: p.height - boxHeight - margin,
                    w: boxWidth,
                    h: boxHeight,
                },
                text: {
                    size: fontSize,
                    padding: margin,
                    lineHeight: fontSize * 1.5,
                },
            };
        }

        const layout = this._debugLayout;

        p.push();

        // Debug box styling
        p.fill(0, 0, 0, 200); // Semi-transparent black background
        p.noStroke();
        p.rect(layout.box.x, layout.box.y, layout.box.w, layout.box.h, 5);

        // Text styling
        p.fill(255, 255, 255); // White text
        p.textSize(layout.text.size);
        p.textAlign(p.LEFT, p.TOP);

        // Render text
        if (this._cachedDebugInfo) {
            p.text(`FPS: ${this._cachedDebugInfo.fps}`, layout.box.x + layout.text.padding, layout.box.y + layout.text.padding);
            p.text(
                `Tick Rate: ${this._cachedDebugInfo.tickRate}/s`,
                layout.box.x + layout.text.padding,
                layout.box.y + layout.text.padding + layout.text.lineHeight,
            );
            p.text(
                `Tick Interval: ${this._cachedDebugInfo.interval}ms`,
                layout.box.x + layout.text.padding,
                layout.box.y + layout.text.padding + layout.text.lineHeight * 2,
            );
            p.text(
                `Delta Time: ${this._cachedDebugInfo.delta}ms`,
                layout.box.x + layout.text.padding,
                layout.box.y + layout.text.padding + layout.text.lineHeight * 3,
            );
        }

        p.pop();
    }
}
