import p5 from 'p5';

import configs from '../../../config/configs';
import { Color } from '../../types/enums';
import { Cell, RendererMetrics } from '../../types/Types';
import { Renderer } from '../../types/modules';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';

export default class DisplayRenderer implements Renderer {
    private _p: p5;

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

    constructor(p: p5) {
        this._p = p;
    }

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

    render(grid: Cell[][]) {
        this._p.push();

        this._p.image(this._staticGraphics, 0, 0);
        this.renderGrid(grid);

        this._p.pop();
    }

    /**
     * Renders static elements (background and borders) to an off-screen buffer.
     */
    private _renderStaticElements() {
        const { borderWeight } = configs.screenLayout.display;

        this._staticGraphics = this._p.createGraphics(this._p.width, this._p.height);

        this._staticGraphics.background(configs.colors.background);

        this._staticGraphics.strokeWeight(RelativeValuesHelper.getRelativeWidth(this._p, borderWeight));
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
     */
    protected renderCell({ coordinate, color, value }: Cell) {
        const { x, y } = coordinate;
        const { innerOffset, innerSize, paddingOffset, paddingSize, strokeWeight } = this._cellPreCalculatedGeometry;

        if (value === 0) {
            color = Color.INACTIVE;
        }

        this._p.push();

        // Move to the specific cell position
        this._p.translate(
            this._rendererMetrics.display.origin.x + x * this._rendererMetrics.cell.size,
            this._rendererMetrics.display.origin.y + y * this._rendererMetrics.cell.size,
        );

        this._p.strokeWeight(strokeWeight);
        this._p.stroke(color);

        // Outer Box
        this._p.noFill();
        this._p.rect(innerOffset, innerOffset, innerSize, innerSize);

        // Inner Fill
        this._p.fill(color);
        this._p.rect(paddingOffset, paddingOffset, paddingSize, paddingSize);

        this._p.pop();
    }

    protected renderGrid(grid: Cell[][]) {
        grid.forEach(row => {
            row.forEach(cell => {
                this.renderCell(cell);
            });
        });
    }
}
