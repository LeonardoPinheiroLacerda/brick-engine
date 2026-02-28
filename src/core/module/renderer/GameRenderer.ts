import { Cell, GameModules, RendererMetrics } from '../../types/Types';
import { Debuggable } from '../../types/Interfaces';
import { Renderer } from '../../types/modules';
import DisplayRenderer from './DisplayRenderer';
import { RendererComposite } from '../../types/modules';
import HudRenderer from './HudRenderer';
import configs from '../../../config/configs';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import CoordinateHelper from '../../helpers/CoordinateHelper';

/**
 * Orchestrating composite module acting as the visual context manager.
 *
 * Implements the {@link RendererComposite} pattern to aggregate the specific display and HUD
 * pipeline. It bridges the mathematical constraints (e.g. converting a relative 0.0-1.0
 * grid position into strict P5 canvas pixels) and ensures layout recalculations happen exactly
 * once during initialization to avoid expensive bounds-checking inside the main draw loops.
 */
export default class GameRenderer implements RendererComposite, Debuggable {
    private _renderers: Renderer[];

    private _displayRenderer: DisplayRenderer;
    private _hudRenderer: HudRenderer;

    // Cache for renderer metrics
    private _rendererMetrics: RendererMetrics;

    /**
     * Injects a sub-renderer routine into the core pipeline queue.
     *
     * @param {Renderer} renderer - The specific layer or boundary drawer.
     * @returns {void} Returns nothing.
     */
    addRenderer(renderer: Renderer) {
        this._renderers.push(renderer);
    }

    /**
     * Instantiates system geometries and pushes strict calculated metrics down the pipeline.
     * Must be invoked prior to the first rendering frame trigger.
     *
     * @returns {void} Returns nothing.
     */
    setup() {
        this._displayRenderer = new DisplayRenderer();
        this._hudRenderer = new HudRenderer();

        this._renderers = [];
        this.addRenderer(this._displayRenderer);
        this.addRenderer(this._hudRenderer);

        // Pre-calculate all metrics here to avoid dependency issues between renderers
        this._calculateMetrics();

        this._renderers.forEach(renderer => renderer.setup(this.rendererMetrics));
    }

    /**
     * Pre-compiles absolute geometric values resolving relative design layouts against the physical hardware space.
     *
     * @returns {void} Returns nothing.
     */
    private _calculateMetrics() {
        const { width, height, margin: displayMargin } = configs.screenLayout.display;
        const { columns: gridColumns } = configs.screenLayout.grid;

        // 1. Calculate main display dimensions
        const displayWidth = RelativeValuesHelper.getRelativeWidth(width);
        const displayHeight = RelativeValuesHelper.getRelativeHeight(height);
        const displayOrigin = CoordinateHelper.getRelativeCoordinate({
            x: displayMargin,
            y: displayMargin,
        });

        // 2. Calculate cell size
        const cellSize = displayWidth / gridColumns;

        // 3. Calculate HUD dimensions
        // Note: We use 0 and 1 to get start and end positions, then calculate width/height
        const hudOrigin = {
            x: CoordinateHelper.getHudPosX(0, displayWidth),
            y: CoordinateHelper.getHudPosY(0, displayHeight),
        };

        const hudWidth = CoordinateHelper.getHudPosX(1, displayWidth) - hudOrigin.x;
        const hudHeight = CoordinateHelper.getHudPosY(1, displayHeight) - hudOrigin.y;

        this._rendererMetrics = {
            display: {
                width: displayWidth,
                height: displayHeight,
                origin: displayOrigin,
            },
            hud: {
                width: hudWidth,
                height: hudHeight,
                origin: hudOrigin,
            },
            cell: {
                size: cellSize,
            },
        };
    }

    /**
     * Exposes the single dispatch drawing sequence forwarding contexts down the entire renderer queue.
     *
     * @param {Cell[][]} grid - The logical playfield state matrix.
     * @param {GameModules} modules - The active state containers injected dynamically.
     * @returns {void} Returns nothing.
     */
    render(grid: Cell[][], modules: GameModules) {
        this._renderers.forEach(renderer => renderer.render(grid, modules));
    }

    /**
     * Retrieves the calculated renderer metrics.
     *
     * @returns {RendererMetrics} The metrics object.
     */
    get rendererMetrics(): RendererMetrics {
        return this._rendererMetrics;
    }

    /**
     * Retrieves debug information about the renderer's calculated metrics.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            display_width: this._rendererMetrics.display.width.toFixed(2),
            display_height: this._rendererMetrics.display.height.toFixed(2),
            hud_width: this._rendererMetrics.hud.width.toFixed(2),
            hud_height: this._rendererMetrics.hud.height.toFixed(2),
            cell_size: this._rendererMetrics.cell.size.toFixed(2),
        };
    }
}
