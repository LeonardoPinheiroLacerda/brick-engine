import p5 from 'p5';

import configs from '../../../config/configs';
import { Color } from '../../types/enums';
import { Cell, GameModules, RendererMetrics } from '../../types/Types';
import { Renderer, State } from '../../types/modules';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import RendererContext from '../../context/RendererContext';

/**
 * Responsible for rendering the main game field (the grid where the game is played).
 * Handles cell rendering, background drawing, and optimizes static elements using an off-screen buffer.
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
     * Initializes the renderer with the calculated metrics.
     * Pre-calculates cell geometry for faster rendering.
     *
     * @param {RendererMetrics} rendererMetrics - The shared renderer metrics.
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
     * Renders the game grid.
     * Draws the static background first, then iterates over the grid to draw cells.
     *
     * @param {Cell[][]} grid - The current grid state.
     */
    render(grid: Cell[][], modules: GameModules) {
        const { p } = RendererContext;
        p.push();

        p.image(this._staticGraphics, 0, 0);
        this.renderGrid(grid, modules.state);

        p.pop();
    }

    /**
     * Renders static elements (background and borders) to an off-screen buffer.
     * This improves performance by avoiding re-drawing static shapes every frame.
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
     * Renders a single brick at grid coordinates.
     * Uses translation matrices to keep drawing logic clean.
     *
     * @param {Cell} cell - The cell data to render.
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
     * Iterates through the grid and renders each cell.
     *
     * @param {Cell[][]} grid - The grid to render.
     */
    protected renderGrid(grid: Cell[][], state: State) {
        grid.forEach(row => {
            row.forEach(cell => {
                this.renderCell(cell, state);
            });
        });
    }
}
