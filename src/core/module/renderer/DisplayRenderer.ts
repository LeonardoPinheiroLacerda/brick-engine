import P5 from 'p5';

import configs from '../../../config/configs';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import Coordinate from '../../interface/Coordinate';
import Cell from '../../interface/Cell';
import Color from '../../enum/Color';
import Renderer from './Renderer';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';

export default class DisplayRenderer implements Renderer {
    private _p: P5;

    private _cellSize: number;
    private _displayWidth: number;
    private _displayHeight: number;

    // Pre-calculated cell geometry
    private _cellPreCalculatedGeometry: {
        innerOffset: number;
        innerSize: number;
        paddingOffset: number;
        paddingSize: number;
        strokeWeight: number;
    };

    // Grid start position in pixels
    private _gridOrigin: Coordinate;

    constructor(p: P5) {
        this._p = p;
    }

    setup() {
        const { width, height, margin: displayMargin } = configs.screenLayout.display;
        const { x: gridColumns } = configs.screenLayout.grid;
        const { margin: cellMargin, padding: cellPadding, strokeWeight: cellStrokeWeight } = configs.screenLayout.cell;

        // 1. Calculate main display dimensions
        this._displayWidth = RelativeValuesHelper.getRelativeWidth(this._p, width);
        this._displayHeight = RelativeValuesHelper.getRelativeHeight(this._p, height);
        this._gridOrigin = CoordinateHelper.getRelativeCoordinate(this._p, {
            x: displayMargin,
            y: displayMargin,
        });

        // 2. Calculate cell size
        this._cellSize = this._displayWidth / gridColumns;

        // 3. Pre-calculate localized cell geometry (relative to cell 0,0)
        this._cellPreCalculatedGeometry = {
            innerOffset: cellMargin * this._cellSize,
            innerSize: this._cellSize - cellMargin * this._cellSize * 2,
            paddingOffset: cellPadding * this._cellSize,
            paddingSize: this._cellSize - cellPadding * this._cellSize * 2,
            strokeWeight: cellStrokeWeight * this._cellSize,
        };

        // TODO: Implement createGraphics buffer to optimize static rendering (background and borders)
    }

    render(grid: Cell[][]) {
        this._p.push();

        this.renderBackground();
        this.renderGameGridBorder();
        this.renderGrid(grid);

        this._p.pop();
    }

    /**
     * Renders the background of the game
     */
    protected renderBackground() {
        this._p.push();

        this._p.background(configs.colors.background);

        this._p.pop();
    }

    /** Renders the border of the game grid */
    protected renderGameGridBorder() {
        const { borderWeight } = configs.screenLayout.display;

        this._p.push();

        this._p.strokeWeight(RelativeValuesHelper.getRelativeWidth(this._p, borderWeight));
        this._p.noFill();
        this._p.stroke(configs.colors.active);
        this._p.rect(this._gridOrigin.x, this._gridOrigin.y, this._displayWidth, this._displayHeight);

        this._p.pop();
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
        this._p.translate(this._gridOrigin.x + x * this._cellSize, this._gridOrigin.y + y * this._cellSize);

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

    get displayWidth(): number {
        return this._displayWidth;
    }

    get displayHeight(): number {
        return this._displayHeight;
    }

    get displayOrigin(): Coordinate {
        return this._gridOrigin;
    }

    get cellSize(): number {
        return this._cellSize;
    }
}
