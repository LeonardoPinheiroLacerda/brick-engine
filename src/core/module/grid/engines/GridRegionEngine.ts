import { Color } from '../../../types/enums';
import { Cell, Coordinate, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Engineering sub-module strictly handling multi-cell batch operations and bounding interactions.
 *
 * Implements the {@link Grid} region processing logic. It aggregates simple cell iterations
 * into unified area bounds to execute high-level game instructions, such as bulk stamping
 * piece shapes or checking broad space availabilities.
 */
export default class GridRegionEngine {
    constructor(private grid: Grid) {}

    /**
     * Extends basic coordinate validation across a multiple-point piece footprint.
     *
     * @param {Coordinate[]} coordinates - The list of point mappings defining the desired area.
     * @returns {boolean} A boolean true if any single piece chunk strikes a grid-wall or populated floor.
     */
    isAreaOccupied(coordinates: Coordinate[]): boolean {
        return coordinates.some(coord => {
            if (!this.grid.isCoordinateValid(coord)) return true;
            const cell = this.grid.getCell(coord);
            return cell && this.grid.isCellActive(cell);
        });
    }

    /**
     * Implements a generic box-shape overwrite mechanism across given 2D diagonal endpoints.
     *
     * @param {Coordinate} start - The initial boundary corner dictating iteration limits.
     * @param {Coordinate} end - The terminating boundary corner closing the drawn box.
     * @param {number} value - The numeric status assigning logical engine density.
     * @param {Color} color - The specific UI token mapping the region aesthetic details.
     * @returns {void} Returns nothing.
     */
    fillArea(start: Coordinate, end: Coordinate, value: number, color: Color): void {
        const xMin = Math.max(0, Math.min(start.x, end.x));
        const xMax = Math.min(this.grid.width - 1, Math.max(start.x, end.x));
        const yMin = Math.max(0, Math.min(start.y, end.y));
        const yMax = Math.min(this.grid.height - 1, Math.max(start.y, end.y));

        for (let y = yMin; y <= yMax; y++) {
            for (let x = xMin; x <= xMax; x++) {
                this.grid.setCellValue({ x, y }, value);
                this.grid.setCellColor({ x, y }, color);
            }
        }
    }

    /**
     * Converts a transient piece's logical blocks fully into permanently anchored static grid spaces.
     *
     * @param {Piece} piece - The collection of logically associated cells ready for injection.
     * @returns {void} Returns nothing.
     */
    stampPiece(piece: Piece): void {
        piece.forEach(cell => this.grid.stampCell(cell));
    }

    /**
     * Translates a single transient logical brick strictly into the grid's memory buffer.
     *
     * @param {Cell} cell - The complex type combining grid location, metadata value, and color payload.
     * @returns {void} Returns nothing.
     */
    stampCell(cell: Cell): void {
        this.grid.setCellValue(cell.coordinate, cell.value);
        this.grid.setCellColor(cell.coordinate, cell.color);
    }
}
