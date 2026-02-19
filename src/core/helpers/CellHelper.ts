import { Color } from '../types/enums';
import { Cell, Coordinate } from '../types/Types';

/**
 * Utility class for creating and managing grid cells.
 */
export default class CellHelper {
    /**
     * Creates a new empty cell at the specified coordinate.
     *
     * @param {Coordinate} coordinate - The location of the new cell.
     * @returns {Cell} A new cell object initialized with value 0 and default color.
     */
    static emptyCell(coordinate: Coordinate): Cell {
        return {
            value: 0,
            color: Color.DEFAULT,
            coordinate,
        };
    }
}
