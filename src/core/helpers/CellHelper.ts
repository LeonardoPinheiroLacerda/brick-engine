import { Color } from '../types/enums';
import { Cell, Coordinate } from '../types/Types';

export default class CellHelper {
    static emptyCell(coordinate: Coordinate): Cell {
        return {
            value: 0,
            color: Color.DEFAULT,
            coordinate,
        };
    }
}
