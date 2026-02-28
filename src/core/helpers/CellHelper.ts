import { Color } from '../types/enums';
import { Cell, Coordinate } from '../types/Types';

/**
 * Static factory utility class for creating and initializing Cell objects.
 *
 * Provides a reliable and centralized mechanism to instantiate default grid
 * cells. This ensures that every cell generated across the engine instances
 * starts with identical baseline properties, preventing inconsistent state setup.
 */
export default class CellHelper {
    /**
     * Creates a new empty cell structure at the specified coordinate.
     *
     * Constructs a baseline entity used primarily by the `GameGrid` to populate
     * its internal matrix during allocation or when a row/column is cleared.
     *
     * @param {Coordinate} coordinate - The precise `{x, y}` grid location to assign to the new cell.
     * @returns {Cell} A new cell object strictly initialized with a `value` of 0 and the `Color.DEFAULT` assignment.
     */
    static emptyCell(coordinate: Coordinate): Cell {
        return {
            value: 0,
            color: Color.DEFAULT,
            coordinate,
        };
    }
}
