import p5 from 'p5';

import configs from '../../../config/configs';
import { Color } from '../../types/enums';
import { Cell, GameModules, RendererMetrics } from '../../types/Types';
import { Renderer, State } from '../../types/modules';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import RendererContext from '../../context/RendererContext';

/**
 * Dedicated visual presentation component isolating grid drawing loops.
 *
 * It decouples the performance-intensive grid enumeration from general game loops.
 * Through pre-compilation (off-screen buffer for background elements) and heavy caching
 * of explicit geometry boundaries (inner offset, padding, strokes), it minimizes real-time
 * calculation depth, effectively stabilizing engine framerate limits.
 */
export default class DisplayRenderer implements Renderer {
    private _rendererMetrics: RendererMetrics;

    // Pre-calculated cell geometry
    private _cellPreCalculatedGeometry: {
        innerOffset: number;
        innerSize: number;
        paddingOffset: number;
        paddingSize: number;
        strokeWeight: number;
    };

    // Static graphics buffer for optimized rendering
    private _staticGraphics: p5.Graphics;

    /**
     * Implements specific internal matrix caches consuming injected absolute layout metrics.
     *
     * @param {RendererMetrics} rendererMetrics - The shared pre-compiled dimension dictionaries.
     * @returns {void} Returns nothing.
     */
    setup(rendererMetrics: RendererMetrics) {
        this._rendererMetrics = rendererMetrics;
        const { margin: cellMargin, padding: cellPadding, strokeWeight: cellStrokeWeight } = configs.screenLayout.cell;

        // Use pre-calculated cell size
        const cellSize = this._rendererMetrics.cell.size;

        // 3. Pre-calculate localized cell geometry (relative to cell 0,0)
        this._cellPreCalculatedGeometry = {
            innerOffset: cellMargin * cellSize,
            innerSize: cellSize - cellMargin * cellSize * 2,
            paddingOffset: cellPadding * cellSize,
            paddingSize: cellSize - cellPadding * cellSize * 2,
            strokeWeight: cellStrokeWeight * cellSize,
        };

        // Initialize static graphics buffer and render static elements
        this._renderStaticElements();
    }

    /**
     * The continuous execution sequence re-painting the primary logical bounds on-screen.
     *
     * It efficiently pastes the off-screen cached background texture before procedurally computing
     * transient piece overlay graphics.
     *
     * @param {Cell[][]} grid - The 2D target matrix identifying block coordinates.
     * @param {GameModules} modules - Dynamic context properties passed directly by the Engine.
     * @returns {void} Returns nothing.
     */
    render(grid: Cell[][], modules: GameModules) {
        const { p } = RendererContext;
        p.push();

        p.image(this._staticGraphics, 0, 0);
        this.renderGrid(grid, modules.state);

        p.pop();
    }

    /**
     * Executes the initial setup closure defining fixed off-screen graphics buffer textures.
     *
     * @returns {void} Returns nothing.
     */
    private _renderStaticElements() {
        const { p } = RendererContext;
        const { borderWeight } = configs.screenLayout.display;

        this._staticGraphics = p.createGraphics(p.width, p.height);

        this._staticGraphics.background(configs.colors.background);

        this._staticGraphics.strokeWeight(RelativeValuesHelper.getRelativeWidth(borderWeight));
        this._staticGraphics.noFill();
        this._staticGraphics.stroke(configs.colors.active);
        this._staticGraphics.rect(
            this._rendererMetrics.display.origin.x,
            this._rendererMetrics.display.origin.y,
            this._rendererMetrics.display.width,
            this._rendererMetrics.display.height,
        );
    }

    /**
     * Processes individual cell geometric construction dynamically translating matrices to prevent nested complex mathematics.
     *
     * @param {Cell} cell - The structured data representing logical bounds and status coloring.
     * @param {State} state - Actively running environment configuration (like color schemes or game over logic).
     * @returns {void} Returns nothing.
     */
    protected renderCell({ coordinate, color, value }: Cell, state: State) {
        const { p } = RendererContext;
        const { x, y } = coordinate;
        const { innerOffset, innerSize, paddingOffset, paddingSize, strokeWeight } = this._cellPreCalculatedGeometry;

        if (value === 0 || (!state.isPlaying() && !state.isPaused())) {
            color = Color.INACTIVE;
        } else {
            color = state.isColorEnabled() ? color : Color.DEFAULT;
        }

        p.push();

        // Move to the specific cell position
        p.translate(
            this._rendererMetrics.display.origin.x + x * this._rendererMetrics.cell.size,
            this._rendererMetrics.display.origin.y + y * this._rendererMetrics.cell.size,
        );

        p.strokeWeight(strokeWeight);
        p.stroke(color);

        // Outer Box
        p.noFill();
        p.rect(innerOffset, innerOffset, innerSize, innerSize);

        // Inner Fill
        p.fill(color);
        p.rect(paddingOffset, paddingOffset, paddingSize, paddingSize);

        p.pop();
    }

    /**
     * Executes the rapid sequence loop covering the active logic matrix.
     *
     * @param {Cell[][]} grid - The logical target state collection.
     * @param {State} state - Active environment flags modifying visual styling.
     * @returns {void} Returns nothing.
     */
    protected renderGrid(grid: Cell[][], state: State) {
        grid.forEach(row => {
            row.forEach(cell => {
                this.renderCell(cell, state);
            });
        });
    }
}
