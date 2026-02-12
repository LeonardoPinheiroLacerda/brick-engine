import P5 from 'p5';
import Coordinate from '../interface/Coordinate';

export default class CoordinateHelper {
    static getRelativeCoordinate(p: P5, coordinate: Coordinate): Coordinate {
        return {
            x: this.getRelativeWidth(p, coordinate.x),
            y: this.getRelativeHeight(p, coordinate.y),
        };
    }

    static getRelativeWidth(p: P5, size: number): number {
        return size * p.width;
    }

    static getRelativeHeight(p: P5, size: number): number {
        return size * p.height;
    }
}
