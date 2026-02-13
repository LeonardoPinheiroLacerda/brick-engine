import P5 from 'p5';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import configs from '../../../config/configs';

export default class TimePerformance {
    // Tick Rate Measurement
    private _ticksThisSecond: number = 0;
    private _timeSinceLastTpsUpdate: number = 0;
    private _actualTickRate: number = 0;

    // Rendering
    private _performanceUpdateCounter: number = 0;
    private _cachedPerformanceInfo: { fps: string; tickRate: string; interval: string; delta: string } | null = null;

    private _layout: {
        canvasWidth: number;
        canvasHeight: number;
        box: { x: number; y: number; w: number; h: number };
        text: { size: number; padding: number; lineHeight: number };
    } | null = null;

    constructor(initialTickRate: number) {
        this._actualTickRate = initialTickRate;
    }

    update(deltaTime: number) {
        // TPS Calculation
        this._timeSinceLastTpsUpdate += deltaTime;
        if (this._timeSinceLastTpsUpdate >= 1000) {
            this._actualTickRate = (this._ticksThisSecond * 1000) / this._timeSinceLastTpsUpdate;
            this._ticksThisSecond = 0;
            this._timeSinceLastTpsUpdate = 0;
        }
    }

    logTick() {
        this._ticksThisSecond++;
    }

    render(p: P5, tickInterval: number) {
        const performanceTickInterval = configs.game.performance.tickInterval;

        if (this._performanceUpdateCounter % performanceTickInterval === 0 || !this._cachedPerformanceInfo) {
            this._cachedPerformanceInfo = {
                fps: p.frameRate().toFixed(0),
                tickRate: this._actualTickRate.toFixed(1),
                interval: tickInterval.toFixed(0),
                delta: p.deltaTime.toFixed(1),
            };
        }
        this._performanceUpdateCounter++;

        // Lazy initialization or update on resize
        if (!this._layout || this._layout.canvasWidth !== p.width || this._layout.canvasHeight !== p.height) {
            const boxWidth = RelativeValuesHelper.getRelativeWidth(p, 0.2929);
            const boxHeight = RelativeValuesHelper.getRelativeHeight(p, 0.165);
            const margin = RelativeValuesHelper.getRelativeWidth(p, 0.01969);
            const fontSize = RelativeValuesHelper.getRelativeHeight(p, 0.0234);

            this._layout = {
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

        const layout = this._layout;

        p.push();

        // Performance box styling
        p.fill(0, 0, 0, 150); // Semi-transparent black background
        p.noStroke();
        p.rect(layout.box.x, layout.box.y, layout.box.w, layout.box.h, 5);

        // Text styling
        p.fill(255, 255, 255); // White text
        p.textSize(layout.text.size);
        p.textAlign(p.LEFT, p.TOP);

        // Render text
        if (this._cachedPerformanceInfo) {
            p.text(`FPS: ${this._cachedPerformanceInfo.fps}`, layout.box.x + layout.text.padding, layout.box.y + layout.text.padding);
            p.text(
                `Tick Rate: ${this._cachedPerformanceInfo.tickRate}/s`,
                layout.box.x + layout.text.padding,
                layout.box.y + layout.text.padding + layout.text.lineHeight,
            );
            p.text(
                `Tick Interval: ${this._cachedPerformanceInfo.interval}ms`,
                layout.box.x + layout.text.padding,
                layout.box.y + layout.text.padding + layout.text.lineHeight * 2,
            );
            p.text(
                `Delta Time: ${this._cachedPerformanceInfo.delta}ms`,
                layout.box.x + layout.text.padding,
                layout.box.y + layout.text.padding + layout.text.lineHeight * 3,
            );
        }

        p.pop();
    }
}
