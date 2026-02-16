import configs from '../../../config/configs';
import { Color } from '../../types/enums';
import CellHelper from '../../helpers/CellHelper';
import { Cell, Coordinate } from '../../types/Types';
import { Debuggable } from '../../types/Interfaces';
import { Grid } from '../../types/modules';

/**
 * Manages the game's logical grid state and operations.
 *
 * Provides a robust API for cell manipulation, row/column management,
 * collision detection, and mass grid modifications.
 */
export default class GameGrid implements Grid, Debuggable {
    /**
     * The internal 2D array representing the game grid [y][x].
     */
    protected _grid: Cell[][] = [];

    // --- CORE & UTILITIES ---

    /**
     * Gets the current grid state as a 2D array of cells.
     *
     * @returns {Cell[][]} The underlying grid data.
     */
    getGrid(): Cell[][] {
        return this._grid;
    }

    /**
     * Gets the number of columns in the grid.
     *
     * @returns {number} The grid width.
     */
    get width(): number {
        return configs.screenLayout.grid.x;
    }

    /**
     * Gets the number of rows in the grid.
     *
     * @returns {number} The grid height.
     */
    get height(): number {
        return configs.screenLayout.grid.y;
    }

    /**
     * Initializes the grid by resetting its content to an empty state.
     *
     * @returns {void}
     */
    setup(): void {
        this.resetGrid();
    }

    /**
     * Resets the entire grid state based on the dimensions defined in the configuration.
     *
     * Populates the grid with empty cells using {@link CellHelper.emptyCell}.
     *
     * @returns {void}
     */
    resetGrid(): void {
        this._grid = [];
        for (let y = 0; y < this.height; y++) {
            this._grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this._grid[y][x] = CellHelper.emptyCell({ x, y });
            }
        }
    }

    /**
     * Iterates over every cell in the grid and executes a callback.
     *
     * @param {function(Cell): void} callback - The function to execute for each cell.
     * @returns {void}
     */
    forEach(callback: (cell: Cell) => void): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                callback(this._grid[y][x]);
            }
        }
    }

    /**
     * Verifies if a given coordinate is within the grid boundaries.
     *
     * @param {Coordinate} coordinate - The coordinate to validate.
     * @returns {boolean} True if the coordinate is valid, false otherwise.
     */
    isValidCoordinate(coordinate: Coordinate): boolean {
        return coordinate.x >= 0 && coordinate.x < this.width && coordinate.y >= 0 && coordinate.y < this.height;
    }

    /**
     * Retrieves a cell at a specific coordinate.
     *
     * @param {Coordinate} coordinate - The coordinate of the cell.
     * @returns {Cell | null} The cell object, or null if out of bounds.
     */
    getCell(coordinate: Coordinate): Cell | null {
        if (!this.isValidCoordinate(coordinate)) {
            return null;
        }
        return this._grid[coordinate.y][coordinate.x];
    }

    /**
     * Updates the status value of a cell at a specific coordinate.
     *
     * @param {Coordinate} coordinate - The target coordinate.
     * @param {number} value - The new value (e.g., 0 for inactive, >0 for active).
     * @returns {void}
     */
    setCellValue(coordinate: Coordinate, value: number): void {
        if (!this.isValidCoordinate(coordinate)) {
            return;
        }
        this._grid[coordinate.y][coordinate.x].value = value;
    }

    /**
     * Updates the color of a cell at a specific coordinate.
     *
     * @param {Coordinate} coordinate - The target coordinate.
     * @param {Color} color - The new color enum value.
     * @returns {void}
     */
    setCellColor(coordinate: Coordinate, color: Color): void {
        if (!this.isValidCoordinate(coordinate)) {
            return;
        }
        this._grid[coordinate.y][coordinate.x].color = color;
    }

    /**
     * Checks if a cell at a specific coordinate is active (value > 0).
     *
     * @param {Coordinate} coordinate - The coordinate to check.
     * @returns {boolean} True if active, false otherwise.
     */
    isCellActive(coordinate: Coordinate): boolean {
        const cell = this.getCell(coordinate);
        return cell !== null && cell.value > 0;
    }

    /**
     * Checks if a cell at a specific coordinate is inactive (value === 0).
     *
     * @param {Coordinate} coordinate - The coordinate to check.
     * @returns {boolean} True if inactive, false otherwise.
     */
    isCellInactive(coordinate: Coordinate): boolean {
        const cell = this.getCell(coordinate);
        return cell !== null && cell.value === 0;
    }

    // --- ROW OPERATIONS ---

    /**
     * Checks if every cell in a specific row is active.
     *
     * @param {number} y - The row index.
     * @returns {boolean} True if the row is completely full.
     */
    isRowFull(y: number): boolean {
        if (y < 0 || y >= this.height) return false;
        return this._grid[y].every(cell => cell.value > 0);
    }

    /**
     * Checks if every cell in a specific row is inactive.
     *
     * @param {number} y - The row index.
     * @returns {boolean} True if the row is completely empty.
     */
    isRowEmpty(y: number): boolean {
        if (y < 0 || y >= this.height) return true;
        return this._grid[y].every(cell => cell.value === 0);
    }

    /**
     * Resets all cells in a specific row to their default empty state.
     *
     * @param {number} y - The row index to clear.
     * @returns {void}
     */
    clearRow(y: number): void {
        if (y < 0 || y >= this.height) return;
        for (let x = 0; x < this.width; x++) {
            this._grid[y][x] = CellHelper.emptyCell({ x, y });
        }
    }

    /**
     * Shifts all rows above a certain index down by one position.
     *
     * Clears the top-most row after shifting.
     *
     * @param {number} fromY - The starting row index for the shift down.
     * @returns {void}
     */
    shiftRowsDown(fromY: number): void {
        for (let y = fromY; y > 0; y--) {
            for (let x = 0; x < this.width; x++) {
                const prevCell = this._grid[y - 1][x];
                this._grid[y][x].value = prevCell.value;
                this._grid[y][x].color = prevCell.color;
            }
        }
        this.clearRow(0);
    }

    /**
     * Shifts all rows below a certain index up by one position.
     *
     * Clears the bottom-most row after shifting.
     *
     * @param {number} fromY - The starting row index for the shift up.
     * @returns {void}
     */
    shiftRowsUp(fromY: number): void {
        for (let y = fromY; y < this.height - 1; y++) {
            for (let x = 0; x < this.width; x++) {
                const nextCell = this._grid[y + 1][x];
                this._grid[y][x].value = nextCell.value;
                this._grid[y][x].color = nextCell.color;
            }
        }
        this.clearRow(this.height - 1);
    }

    /**
     * Scans the grid for full rows, clears them, and shifts remaining rows down.
     *
     * Re-checks the same index after a shift to handle consecutive full rows.
     *
     * @returns {number} The total number of rows cleared during the operation.
     */
    clearFullRows(): number {
        let rowsCleared = 0;
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.isRowFull(y)) {
                this.clearRow(y);
                this.shiftRowsDown(y);
                rowsCleared++;
                y++; // Re-check the same row index after shifting
            }
        }
        return rowsCleared;
    }

    // --- COLUMN OPERATIONS ---

    /**
     * Checks if every cell in a specific column is active.
     *
     * @param {number} x - The column index.
     * @returns {boolean} True if the column is completely full.
     */
    isColumnFull(x: number): boolean {
        if (x < 0 || x >= this.width) return false;
        for (let y = 0; y < this.height; y++) {
            if (this._grid[y][x].value === 0) return false;
        }
        return true;
    }

    /**
     * Checks if every cell in a specific column is inactive.
     *
     * @param {number} x - The column index.
     * @returns {boolean} True if the column is completely empty.
     */
    isColumnEmpty(x: number): boolean {
        if (x < 0 || x >= this.width) return true;
        for (let y = 0; y < this.height; y++) {
            if (this._grid[y][x].value !== 0) return false;
        }
        return true;
    }

    /**
     * Resets all cells in a specific column to their default empty state.
     *
     * @param {number} x - The column index to clear.
     * @returns {void}
     */
    clearColumn(x: number): void {
        if (x < 0 || x >= this.width) return;
        for (let y = 0; y < this.height; y++) {
            this._grid[y][x] = CellHelper.emptyCell({ x, y });
        }
    }

    /**
     * Shifts all columns to the left of a certain index one position to the right.
     *
     * Clears the left-most column (index 0) after shifting.
     *
     * @param {number} fromX - The starting column index for the shift right.
     * @returns {void}
     */
    shiftColumnsRight(fromX: number): void {
        for (let x = fromX; x > 0; x--) {
            for (let y = 0; y < this.height; y++) {
                const prevCell = this._grid[y][x - 1];
                this._grid[y][x].value = prevCell.value;
                this._grid[y][x].color = prevCell.color;
            }
        }
        this.clearColumn(0);
    }

    /**
     * Shifts all columns to the right of a certain index one position to the left.
     *
     * Clears the right-most column after shifting.
     *
     * @param {number} fromX - The starting column index for the shift left.
     * @returns {void}
     */
    shiftColumnsLeft(fromX: number): void {
        for (let x = fromX; x < this.width - 1; x++) {
            for (let y = 0; y < this.height; y++) {
                const nextCell = this._grid[y][x + 1];
                this._grid[y][x].value = nextCell.value;
                this._grid[y][x].color = nextCell.color;
            }
        }
        this.clearColumn(this.width - 1);
    }

    /**
     * Scans the grid for full columns, clears them, and shifts remaining columns right.
     *
     * @returns {number} The total number of columns cleared during the operation.
     */
    clearFullColumns(): number {
        let columnsCleared = 0;
        for (let x = this.width - 1; x >= 0; x--) {
            if (this.isColumnFull(x)) {
                this.clearColumn(x);
                this.shiftColumnsRight(x);
                columnsCleared++;
                x++; // Re-check the same column index after shifting
            }
        }
        return columnsCleared;
    }

    // --- ADVANCED OPERATIONS ---

    /**
     * Checks if any of the provided coordinates are already occupied (active) or out of bounds.
     *
     * @param {Coordinate[]} coordinates - An array of coordinates to check.
     * @returns {boolean} True if the area is occupied or invalid, false if completely clear.
     */
    isAreaOccupied(coordinates: Coordinate[]): boolean {
        return coordinates.some(coord => {
            if (!this.isValidCoordinate(coord)) return true;
            return this.isCellActive(coord);
        });
    }

    /**
     * Fills a rectangular region defined by two corners with a specific value and color.
     *
     * Automatically handles bounds and coordinate order.
     *
     * @param {Coordinate} start - One corner of the rectangle.
     * @param {Coordinate} end - The opposite corner of the rectangle.
     * @param {number} value - The cell status value to apply.
     * @param {Color} color - The color to apply.
     * @returns {void}
     */
    fillArea(start: Coordinate, end: Coordinate, value: number, color: Color): void {
        const xMin = Math.max(0, Math.min(start.x, end.x));
        const xMax = Math.min(this.width - 1, Math.max(start.x, end.x));
        const yMin = Math.max(0, Math.min(start.y, end.y));
        const yMax = Math.min(this.height - 1, Math.max(start.y, end.y));

        for (let y = yMin; y <= yMax; y++) {
            for (let x = xMin; x <= xMax; x++) {
                this.setCellValue({ x, y }, value);
                this.setCellColor({ x, y }, color);
            }
        }
    }

    /**
     * Applies a value and color to multiple coordinates simultaneously.
     *
     * Effectively "stamps" a piece's shape onto the static grid.
     *
     * @param {Coordinate[]} coordinates - The list of coordinates to update.
     * @param {number} value - The status value to apply.
     * @param {Color} color - The color to apply.
     * @returns {void}
     */
    stampPiece(coordinates: Coordinate[], value: number, color: Color): void {
        coordinates.forEach(coord => {
            this.setCellValue(coord, value);
            this.setCellColor(coord, color);
        });
    }

    getDebugData(): Record<string, string | number | boolean> {
        return {
            width: this.width,
            height: this.height,
        };
    }
}
