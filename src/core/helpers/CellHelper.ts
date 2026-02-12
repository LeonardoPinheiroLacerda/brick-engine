import Color from '../enum/Color';
import Cell from '../interface/Cell';
import Coordinate from '../interface/Coordinate';

export default class CellHelper {
    static emptyCell(coordinate: Coordinate): Cell {
        return {
            value: 0,
            color: Color.DEFAULT,
            coordinate,
        };
    }
}
