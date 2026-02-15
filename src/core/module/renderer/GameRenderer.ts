import P5 from 'p5';
import { Cell, GameModules, RendererMetrics } from '../../types/Types';
import { Renderer } from '../../types/modules';
import DisplayRenderer from './DisplayRenderer';
import { RendererComposite } from '../../types/modules';
import HudRenderer from './HudRenderer';
import configs from '../../../config/configs';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import CoordinateHelper from '../../helpers/CoordinateHelper';

export default class GameRenderer implements RendererComposite {
    private _p: P5;

    private _renderers: Renderer[];

    private _displayRenderer: DisplayRenderer;
    private _hudRenderer: HudRenderer;

    // Cache for renderer metrics
    private _rendererMetrics: RendererMetrics;

    constructor(p: P5) {
        this._p = p;
    }

    addRenderer(renderer: Renderer) {
        this._renderers.push(renderer);
    }

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

    private _calculateMetrics() {
        const { width, height, margin: displayMargin } = configs.screenLayout.display;
        const { x: gridColumns } = configs.screenLayout.grid;

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

    render(grid: Cell[][], modules: GameModules) {
        this._renderers.forEach(renderer => renderer.render(grid, modules));
    }

    get rendererMetrics(): RendererMetrics {
        return this._rendererMetrics;
    }
}
