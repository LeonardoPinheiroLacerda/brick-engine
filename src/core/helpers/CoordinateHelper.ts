import P5 from 'p5';
import Coordinate from '../interface/Coordinate';

export default class CoordinateHelper {
    private _p: P5;

    constructor(p: P5) {
        this._p = p;
    }

    getRelativeCoordinate({ x, y }: Coordinate): Coordinate {
        return {
            x: this.getRelativeWidth(x),
            y: this.getRelativeHeight(y),
        };
    }

    getRelativeWidth(size: number): number {
        return size * this._p.width;
    }

    getRelativeHeight(size: number): number {
        return size * this._p.height;
    }

    getCellCoordinate(
        { x, y }: Coordinate,
        cellSize: number,
        margin: number,
    ): Coordinate {
        return {
            x: x * cellSize + margin,
            y: y * cellSize + margin,
        };
    }
}
