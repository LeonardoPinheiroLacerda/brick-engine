import Color from '../enum/Color';
import Cell from '../types/Cell';
import Coordinate from '../types/Coordinate';

export default class CellHelper {
    static emptyCell(coordinate: Coordinate): Cell {
        return {
            value: 0,
            color: Color.DEFAULT,
            coordinate,
        };
    }
}
