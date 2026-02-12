import { Color } from '../interface/enums';
import { Cell, Coordinate } from '../interface/Types';

export default class CellHelper {
    static emptyCell(coordinate: Coordinate): Cell {
        return {
            value: 0,
            color: Color.DEFAULT,
            coordinate,
        };
    }
}
