import p5 from 'p5';
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
 * Composite renderer that manages multiple sub-renderers.
 * Orchestrates the rendering of the main display and the HUD.
 * Handles the calculation of shared rendering metrics (sizes, positions) to ensure consistency.
 */
export default class GameRenderer implements RendererComposite, Debuggable {
    private _p: p5;

    private _renderers: Renderer[];

    private _displayRenderer: DisplayRenderer;
    private _hudRenderer: HudRenderer;

    // Cache for renderer metrics
    private _rendererMetrics: RendererMetrics;

    /**
     * Creates an instance of GameRenderer.
     *
     * @param {p5} p - The p5 instance.
     */
    constructor(p: p5) {
        this._p = p;
    }

    /**
     * Adds a sub-renderer to the composition.
     *
     * @param {Renderer} renderer - The renderer to add.
     */
    addRenderer(renderer: Renderer) {
        this._renderers.push(renderer);
    }

    /**
     * Initializes all sub-renderers and calculates layout metrics.
     * This method must be called before rendering begins.
     */
    setup() {
        this._displayRenderer = new DisplayRenderer(this._p);
        this._hudRenderer = new HudRenderer(this._p);

        this._renderers = [];
        this.addRenderer(this._displayRenderer);
        this.addRenderer(this._hudRenderer);

        // Pre-calculate all metrics here to avoid dependency issues between renderers
        this._calculateMetrics();

        this._renderers.forEach(renderer => renderer.setup(this.rendererMetrics));
    }

    /**
     * Calculates the layout dimensions for the display and HUD.
     * Based on screen configuration and relative values.
     */
    private _calculateMetrics() {
        const { width, height, margin: displayMargin } = configs.screenLayout.display;
        const { columns: gridColumns } = configs.screenLayout.grid;

        // 1. Calculate main display dimensions
        const displayWidth = RelativeValuesHelper.getRelativeWidth(this._p, width);
        const displayHeight = RelativeValuesHelper.getRelativeHeight(this._p, height);
        const displayOrigin = CoordinateHelper.getRelativeCoordinate(this._p, {
            x: displayMargin,
            y: displayMargin,
        });

        // 2. Calculate cell size
        const cellSize = displayWidth / gridColumns;

        // 3. Calculate HUD dimensions
        // Note: We use 0 and 1 to get start and end positions, then calculate width/height
        const hudOrigin = {
            x: CoordinateHelper.getHudPosX(this._p, 0, displayWidth),
            y: CoordinateHelper.getHudPosY(this._p, 0, displayHeight),
        };

        const hudWidth = CoordinateHelper.getHudPosX(this._p, 1, displayWidth) - hudOrigin.x;
        const hudHeight = CoordinateHelper.getHudPosY(this._p, 1, displayHeight) - hudOrigin.y;

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
     * Delegating render method.
     * Calls render on all registered sub-renderers.
     *
     * @param {Cell[][]} grid - The main game grid.
     * @param {GameModules} modules - The game modules collection.
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
