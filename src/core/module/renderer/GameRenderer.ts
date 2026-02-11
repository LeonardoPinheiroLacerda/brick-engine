import P5 from 'p5';

import configs from '../../../config/configs';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import Coordinate from '../../interface/Coordinate';

export default class GameRenderer {
    private _p: P5;

    private _coordinateHelper: CoordinateHelper;

    private _cellSize: number;
    private _displayWidth: number;
    private _displayHeight: number;

    constructor(p: P5) {
        this._p = p;
        this._coordinateHelper = new CoordinateHelper(p);
    }

    setup() {
        const { width, height } = configs.screenLayout.display;
        const { x: gridX } = configs.screenLayout.grid;

        this._displayWidth = this._coordinateHelper.getRelativeWidth(width);
        this._displayHeight = this._coordinateHelper.getRelativeHeight(height);

        this._cellSize = this._displayWidth / gridX;
    }

    protected renderBackground() {
        this._p.background(configs.colors.background);
    }

    protected renderGameGridBorder() {
        const { margin, borderWeight } = configs.screenLayout.display;

        //
        const { x, y } = this._coordinateHelper.getRelativeCoordinate({
            x: margin,
            y: margin,
        });

        this._p.strokeWeight(
            this._coordinateHelper.getRelativeWidth(borderWeight),
        );
        this._p.noFill();
        this._p.stroke(configs.colors.active);
        this._p.rect(x, y, this._displayWidth, this._displayHeight);
    }

    renderFrame() {
        this.renderBackground();
        this.renderGameGridBorder();

        this.renderCell({ x: 0, y: 0 });
        this.renderCell({ x: 10, y: 0 });

        this.renderCell({ x: 5, y: 5 });
        this.renderCell({ x: 6, y: 5 });
        this.renderCell({ x: 5, y: 6 });
        this.renderCell({ x: 6, y: 6 });
    }

    renderCell({ x, y }: Coordinate) {
        const { margin, padding, strokeWeight } = configs.screenLayout.cell;
        const { x: gridX, y: gridY } = configs.screenLayout.grid;

        const cellCoordinate = this._coordinateHelper.getCellCoordinate(
            { x, y },
            this._cellSize,
            this._coordinateHelper.getRelativeWidth(
                configs.screenLayout.display.margin,
            ),
        );

        // const cellSizeWithoutMargin = this._cellSize - margin * this._cellSize;

        this._p.strokeWeight(strokeWeight * this._cellSize);

        // alert(this._displayWidth);

        this._p.stroke(configs.colors.inactive);

        this._p.noFill();

        this._p.rect(
            cellCoordinate.x + margin * this._cellSize,
            cellCoordinate.y + margin * this._cellSize,
            this._cellSize - margin * this._cellSize * 2,
            this._cellSize - margin * this._cellSize * 2,
        );

        this._p.fill(configs.colors.inactive);

        this._p.rect(
            cellCoordinate.x + padding * this._cellSize,
            cellCoordinate.y + padding * this._cellSize,
            this._cellSize - padding * this._cellSize * 2,
            this._cellSize - padding * this._cellSize * 2,
        );

        // this._p.rect(
        //     cellCoordinate.x + (padding + margin) * this._cellSize,
        //     cellCoordinate.y + (padding + margin) * this._cellSize,
        //     cellSizeWithoutMargin - padding * this._cellSize * 2,
        //     cellSizeWithoutMargin - padding * this._cellSize * 2,
        // );
    }
}
