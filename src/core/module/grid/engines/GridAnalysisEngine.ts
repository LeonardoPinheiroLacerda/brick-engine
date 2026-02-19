import { Cell, Coordinate, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Handles analysis and search operations on the grid.
 */
export default class GridAnalysisEngine {
    constructor(private grid: Grid) {}

    /**
     * Identifies all rows that are completely filled with active cells.
     */
    getFullRows(): number[] {
        const fullRows: number[] = [];
        for (let y = 0; y < this.grid.height; y++) {
            let isFull = true;
            for (let x = 0; x < this.grid.width; x++) {
                if (!this.grid.isCellActive({ x, y })) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) fullRows.push(y);
        }
        return fullRows;
    }

    /**
     * Identifies all columns that are completely filled with active cells.
     */
    getFullColumns(): number[] {
        const fullColumns: number[] = [];
        for (let x = 0; x < this.grid.width; x++) {
            let isFull = true;
            for (let y = 0; y < this.grid.height; y++) {
                if (!this.grid.isCellActive({ x, y })) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) fullColumns.push(x);
        }
        return fullColumns;
    }

    /**
     * Returns the active cells adjacent to a specific coordinate.
     */
    getNeighbors(coord: Coordinate, includeDiagonal: boolean = false): Cell[] {
        const neighbors: Cell[] = [];
        const offsets = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
        ];

        if (includeDiagonal) {
            offsets.push({ x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 });
        }

        offsets.forEach(offset => {
            const neighborCoord = { x: coord.x + offset.x, y: coord.y + offset.y };
            if (this.grid.isValidCoordinate(neighborCoord)) {
                neighbors.push(this.grid.getCell(neighborCoord));
            }
        });

        return neighbors;
    }

    /**
     * Finds all connected active cells of the same value starting from a specific coordinate.
     */
    findConnectedCells(coord: Coordinate): Piece {
        if (!this.grid.isCellActive(coord)) return [];

        const startCell = this.grid.getCell(coord);
        const targetValue = startCell.value;
        const connected: Piece = [];
        const visited = new Set<string>();
        const queue: Coordinate[] = [coord];

        const getCoordKey = (c: Coordinate) => `${c.x},${c.y}`;
        visited.add(getCoordKey(coord));

        while (queue.length > 0) {
            const current = queue.shift()!;
            const cell = this.grid.getCell(current);

            if (cell.value === targetValue) {
                connected.push(cell);

                const neighbors = [
                    { x: current.x - 1, y: current.y },
                    { x: current.x + 1, y: current.y },
                    { x: current.x, y: current.y - 1 },
                    { x: current.x, y: current.y + 1 },
                ];

                neighbors.forEach(n => {
                    const key = getCoordKey(n);
                    if (this.grid.isValidCoordinate(n) && !visited.has(key) && this.grid.isCellActive(n)) {
                        visited.add(key);
                        queue.push(n);
                    }
                });
            }
        }

        return connected;
    }

    /**
     * Swaps the values and colors of two cells.
     */
    swapCells(a: Coordinate, b: Coordinate): void {
        const cellA = { ...this.grid.getCell(a) };
        const cellB = { ...this.grid.getCell(b) };

        this.grid.stampCell({ ...cellB, coordinate: a });
        this.grid.stampCell({ ...cellA, coordinate: b });
    }
}
