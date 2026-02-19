import { Color } from '../../../types/enums';
import { Cell, Coordinate, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Handles region-based operations (areas, stamps, and occupancy) on the grid.
 */
export default class GridRegionEngine {
    constructor(private grid: Grid) {}

    /**
     * Checks if any of the provided coordinates are already occupied or out of bounds.
     */
    isAreaOccupied(coordinates: Coordinate[]): boolean {
        return coordinates.some(coord => {
            if (!this.grid.isValidCoordinate(coord)) return true;
            return this.grid.isCellActive(coord);
        });
    }

    /**
     * Fills a rectangular region defined by two corners with a specific value and color.
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
     * Updates multiple coordinates simultaneously with their specific values and colors.
     */
    stampPiece(piece: Piece): void {
        piece.forEach(cell => this.grid.stampCell(cell));
    }

    /**
     * Updates a single coordinate with a specific value and color from a Cell.
     */
    stampCell(cell: Cell): void {
        this.grid.setCellValue(cell.coordinate, cell.value);
        this.grid.setCellColor(cell.coordinate, cell.color);
    }
}
