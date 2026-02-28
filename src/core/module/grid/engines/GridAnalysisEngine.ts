import { Cell, Coordinate, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Engineering sub-module providing structural data mapping and traversal logic.
 *
 * Implements the {@link Grid} analytical operations. It specializes in read-only iterations,
 * like returning complete line matrices, verifying connected graph components (via logic like BFS),
 * and securely interacting with cell metadata without persisting changes automatically.
 */
export default class GridAnalysisEngine {
    constructor(private grid: Grid) {}

    /**
     * Sweeps horizontally evaluating grid integrity across specific vertical line coordinates.
     *
     * @returns {number[]} An array mapping integer strings to valid completed row limits.
     */
    getFullRows(): number[] {
        const fullRows: number[] = [];
        for (let y = 0; y < this.grid.height; y++) {
            let isFull = true;
            for (let x = 0; x < this.grid.width; x++) {
                const gridCell = this.grid.getCell({ x, y });
                if (gridCell && !this.grid.isCellActive(gridCell)) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) fullRows.push(y);
        }
        return fullRows;
    }

    /**
     * Sweeps vertically evaluating grid integrity across specific horizontal line coordinates.
     *
     * @returns {number[]} An array mapping integer strings to valid completed column limits.
     */
    getFullColumns(): number[] {
        const fullColumns: number[] = [];
        for (let x = 0; x < this.grid.width; x++) {
            let isFull = true;
            for (let y = 0; y < this.grid.height; y++) {
                const gridCell = this.grid.getCell({ x, y });
                if (gridCell && !this.grid.isCellActive(gridCell)) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) fullColumns.push(x);
        }
        return fullColumns;
    }

    /**
     * Inspects surrounding spaces around a central anchor leveraging specific pixel offsets.
     *
     * @param {Coordinate} coord - The central coordinate checking all immediate directions.
     * @param {boolean} [includeDiagonal=false] - Broadens strict 4-neighbor searches to all corners.
     * @returns {Cell[]} Array of loaded grid cells directly interfacing the starting point.
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
            if (this.grid.isCoordinateValid(neighborCoord)) {
                const neighborCell = this.grid.getCell(neighborCoord);
                if (neighborCell) neighbors.push(neighborCell);
            }
        });

        return neighbors;
    }

    /**
     * Orchestrates a Breadth-First Search (BFS) algorithm chaining adjacent blocks with identical density signatures.
     *
     * @param {Coordinate} coord - The starting block containing the desired active target density.
     * @returns {Piece} An aggregated piece matching every adjacent cell linked continuously.
     */
    findConnectedCells(coord: Coordinate): Piece {
        const startCell = this.grid.getCell(coord);
        if (!startCell || !this.grid.isCellActive(startCell)) return [];

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
                    const nCell = this.grid.getCell(n);
                    if (this.grid.isCoordinateValid(n) && !visited.has(key) && nCell && this.grid.isCellActive(nCell)) {
                        visited.add(key);
                        queue.push(n);
                    }
                });
            }
        }

        return connected;
    }

    /**
     * Executes an encapsulated memory exchange operation overriding values safely between two points.
     *
     * @param {Coordinate} a - First point target.
     * @param {Coordinate} b - Second point target.
     * @returns {void} Returns nothing.
     */
    swapCells(a: Coordinate, b: Coordinate): void {
        const cellA = { ...this.grid.getCell(a) };
        const cellB = { ...this.grid.getCell(b) };

        this.grid.stampCell({ ...cellB, coordinate: a });
        this.grid.stampCell({ ...cellA, coordinate: b });
    }
}
