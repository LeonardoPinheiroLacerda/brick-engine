import configs from '../../../config/configs';
import { Color } from '../../types/enums';
import CellHelper from '../../helpers/CellHelper';
import { Cell, Coordinate, Vector, Piece, Axis } from '../../types/Types';
import { Debuggable } from '../../types/Interfaces';
import { Grid } from '../../types/modules';
import GridMovementEngine from './engines/GridMovementEngine';
import GridTransformEngine from './engines/GridTransformEngine';
import GridAnalysisEngine from './engines/GridAnalysisEngine';
import GridLineEngine from './engines/GridLineEngine';
import GridRegionEngine from './engines/GridRegionEngine';
import { Serializable } from '../../../types/interfaces';

/**
 * Manages the game's logical grid state and operations.
 *
 * Provides a robust API for cell manipulation, row/column management,
 * collision detection, and mass grid modifications.
 */
export default class GameGrid implements Grid, Debuggable, Serializable {
    /**
     * The internal 2D array representing the game grid [y][x].
     */
    protected _grid: Cell[][] = [];

    private _movementEngine: GridMovementEngine;
    private _transformEngine: GridTransformEngine;
    private _analysisEngine: GridAnalysisEngine;
    private _lineEngine: GridLineEngine;
    private _regionEngine: GridRegionEngine;

    serialId: string = 'grid';

    constructor() {
        this._movementEngine = new GridMovementEngine(this);
        this._transformEngine = new GridTransformEngine(this);
        this._analysisEngine = new GridAnalysisEngine(this);
        this._lineEngine = new GridLineEngine(this);
        this._regionEngine = new GridRegionEngine(this);
    }

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
        return configs.screenLayout.grid.columns;
    }

    /**
     * Gets the number of rows in the grid.
     *
     * @returns {number} The grid height.
     */
    get height(): number {
        return configs.screenLayout.grid.rows;
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
        return this._lineEngine.isRowFull(y);
    }

    /**
     * Checks if every cell in a specific row is inactive.
     *
     * @param {number} y - The row index.
     * @returns {boolean} True if the row is completely empty.
     */
    isRowEmpty(y: number): boolean {
        return this._lineEngine.isRowEmpty(y);
    }

    /**
     * Resets all cells in a specific row to their default empty state.
     *
     * @param {number} y - The row index to clear.
     * @returns {void}
     */
    clearRow(y: number): void {
        this._lineEngine.clearRow(y);
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
        this._lineEngine.shiftRowsDown(fromY);
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
        this._lineEngine.shiftRowsUp(fromY);
    }

    /**
     * Scans the grid for full rows, clears them, and shifts remaining rows down.
     *
     * Re-checks the same index after a shift to handle consecutive full rows.
     *
     * @returns {number} The total number of rows cleared during the operation.
     */
    clearFullRows(): number {
        return this._lineEngine.clearFullRows();
    }

    // --- COLUMN OPERATIONS ---

    /**
     * Checks if every cell in a specific column is active.
     *
     * @param {number} x - The column index.
     * @returns {boolean} True if the column is completely full.
     */
    isColumnFull(x: number): boolean {
        return this._lineEngine.isColumnFull(x);
    }

    /**
     * Checks if every cell in a specific column is inactive.
     *
     * @param {number} x - The column index.
     * @returns {boolean} True if the column is completely empty.
     */
    isColumnEmpty(x: number): boolean {
        return this._lineEngine.isColumnEmpty(x);
    }

    /**
     * Resets all cells in a specific column to their default empty state.
     *
     * @param {number} x - The column index to clear.
     * @returns {void}
     */
    clearColumn(x: number): void {
        this._lineEngine.clearColumn(x);
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
        this._lineEngine.shiftColumnsRight(fromX);
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
        this._lineEngine.shiftColumnsLeft(fromX);
    }

    /**
     * Scans the grid for full columns, clears them, and shifts remaining columns right.
     *
     * @returns {number} The total number of columns cleared during the operation.
     */
    clearFullColumns(): number {
        return this._lineEngine.clearFullColumns();
    }

    // --- ADVANCED OPERATIONS ---

    /**
     * Checks if any of the provided coordinates are already occupied (active) or out of bounds.
     *
     * @param {Coordinate[]} coordinates - An array of coordinates to check.
     * @returns {boolean} True if the area is occupied or invalid, false if completely clear.
     */
    isAreaOccupied(coordinates: Coordinate[]): boolean {
        return this._regionEngine.isAreaOccupied(coordinates);
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
        this._regionEngine.fillArea(start, end, value, color);
    }

    /**
     * Updates multiple coordinates simultaneously with their specific values and colors.
     *
     * Effectively "stamps" a piece's shape onto the static grid.
     *
     * @param {Piece} piece - The collection of cells to stamp.
     * @returns {void}
     */
    stampPiece(piece: Piece): void {
        this._regionEngine.stampPiece(piece);
    }

    /**
     * Updates a single coordinate with a specific value and color from a Cell.
     *
     * @param {Cell} cell - The cell containing coordinate, value and color.
     * @returns {void}
     */
    stampCell(cell: Cell): void {
        this._regionEngine.stampCell(cell);
    }

    /**
     * Attempts to shift a collection of cells (a piece) in a given direction.
     *
     * Validates that all new positions are within grid boundaries and are not
     * occupied by other active cells (excluding the cells that are part of the original piece).
     *
     * @param {Piece} piece - The current piece (collection of cells).
     * @param {Vector} direction - The movement vector (e.g., {x: -1, y: 0} for left).
     * @returns {Piece | null} The new piece with updated coordinates if the move is valid, or null if blocked.
     */
    movePiece(piece: Piece, direction: Vector): Piece | null {
        return this._movementEngine.movePiece(piece, direction);
    }

    /**
     * Alias for {@link movePiece} shifting one unit to the left.
     * @param {Piece} piece - The current piece.
     * @returns {Piece | null}
     */
    movePieceLeft(piece: Piece): Piece | null {
        return this._movementEngine.movePieceLeft(piece);
    }

    /**
     * Alias for {@link movePiece} shifting one unit to the right.
     * @param {Piece} piece - The current piece.
     * @returns {Piece | null}
     */
    movePieceRight(piece: Piece): Piece | null {
        return this._movementEngine.movePieceRight(piece);
    }

    /**
     * Alias for {@link movePiece} shifting one unit up.
     * @param {Piece} piece - The current piece.
     * @returns {Piece | null}
     */
    movePieceUp(piece: Piece): Piece | null {
        return this._movementEngine.movePieceUp(piece);
    }

    /**
     * Alias for {@link movePiece} shifting one unit down.
     * @param {Piece} piece - The current piece.
     * @returns {Piece | null}
     */
    movePieceDown(piece: Piece): Piece | null {
        return this._movementEngine.movePieceDown(piece);
    }

    /**
     * Attempts to shift a single cell in a given direction.
     *
     * Validates that the new position is within grid boundaries and is not occupied.
     *
     * @param {Cell} cell - The current cell.
     * @param {Vector} direction - The movement vector.
     * @returns {Cell | null} The new cell with updated coordinate if the move is valid, or null if blocked.
     */
    moveCell(cell: Cell, direction: Vector): Cell | null {
        return this._movementEngine.moveCell(cell, direction);
    }

    /**
     * Alias for {@link moveCell} shifting one unit to the left.
     * @param {Cell} cell - The current cell.
     * @returns {Cell | null}
     */
    moveCellLeft(cell: Cell): Cell | null {
        return this._movementEngine.moveCellLeft(cell);
    }

    /**
     * Alias for {@link moveCell} shifting one unit to the right.
     * @param {Cell} cell - The current cell.
     * @returns {Cell | null}
     */
    moveCellRight(cell: Cell): Cell | null {
        return this._movementEngine.moveCellRight(cell);
    }

    /**
     * Alias for {@link moveCell} shifting one unit up.
     * @param {Cell} cell - The current cell.
     * @returns {Cell | null}
     */
    moveCellUp(cell: Cell): Cell | null {
        return this._movementEngine.moveCellUp(cell);
    }

    /**
     * Alias for {@link moveCell} shifting one unit down.
     * @param {Cell} cell - The current cell.
     * @returns {Cell | null}
     */
    moveCellDown(cell: Cell): Cell | null {
        return this._movementEngine.moveCellDown(cell);
    }

    /**
     * Attempts to rotate a piece 90 degrees around a specific origin.
     *
     * @param {Piece} piece - The current piece.
     * @param {Coordinate} origin - The center of rotation.
     * @param {boolean} [clockwise=true] - Direction of rotation.
     * @returns {Piece | null} The new piece if rotation is valid, or null if blocked.
     */
    rotatePiece(piece: Piece, origin: Coordinate, clockwise: boolean = true): Piece | null {
        return this._transformEngine.rotatePiece(piece, origin, clockwise);
    }

    /**
     * Identifies all rows that are completely filled with active cells.
     *
     * @returns {number[]} Array of row indices (y).
     */
    getFullRows(): number[] {
        return this._analysisEngine.getFullRows();
    }

    /**
     * Identifies all columns that are completely filled with active cells.
     *
     * @returns {number[]} Array of column indices (x).
     */
    getFullColumns(): number[] {
        return this._analysisEngine.getFullColumns();
    }

    /**
     * Calculates the final resting position of a piece if it were dropped continuously.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its final vertical resting position.
     */
    getDropPath(piece: Piece): Piece {
        return this._movementEngine.getDropPath(piece);
    }

    /**
     * Calculates the final resting position of a piece if it were moved continuously upwards.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its highest vertical resting position.
     */
    getRisePath(piece: Piece): Piece {
        return this._movementEngine.getRisePath(piece);
    }

    /**
     * Calculates the final resting position of a piece if it were moved continuously to the left.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its leftmost resting position.
     */
    getReachPathLeft(piece: Piece): Piece {
        return this._movementEngine.getReachPathLeft(piece);
    }

    /**
     * Calculates the final resting position of a piece if it were moved continuously to the right.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its rightmost resting position.
     */
    getReachPathRight(piece: Piece): Piece {
        return this._movementEngine.getReachPathRight(piece);
    }

    /**
     * Returns the active cells adjacent to a specific coordinate.
     *
     * @param {Coordinate} coord - The center coordinate.
     * @param {boolean} [includeDiagonal=false] - Whether to include 8 neighbors or just 4.
     * @returns {Cell[]} List of neighboring cells.
     */
    getNeighbors(coord: Coordinate, includeDiagonal: boolean = false): Cell[] {
        return this._analysisEngine.getNeighbors(coord, includeDiagonal);
    }

    /**
     * Finds all connected active cells of the same value starting from a specific coordinate.
     * Uses a Breadth-First Search (BFS) algorithm.
     *
     * @param {Coordinate} coord - Starting coordinate.
     * @returns {Piece} Collection of connected cells.
     */
    findConnectedCells(coord: Coordinate): Piece {
        return this._analysisEngine.findConnectedCells(coord);
    }

    /**
     * Mirrors a piece across a specific axis relative to its bounding box.
     *
     * @param {Piece} piece - The piece to mirror.
     * @param {Axis} axis - The axis to flip across ('x' for horizontal flip, 'y' for vertical).
     * @returns {Piece} The mirrored piece.
     */
    mirrorPiece(piece: Piece, axis: Axis): Piece {
        return this._transformEngine.mirrorPiece(piece, axis);
    }

    /**
     * Swaps the values and colors of two cells.
     *
     * @param {Coordinate} a - First coordinate.
     * @param {Coordinate} b - Second coordinate.
     * @returns {void}
     */
    swapCells(a: Coordinate, b: Coordinate): void {
        this._analysisEngine.swapCells(a, b);
    }

    /**
     * Private helper to get piece bounds, delegated to transform engine.
     */
    protected getPieceBounds(piece: Piece): { min: Coordinate; max: Coordinate } {
        return this._transformEngine.getPieceBounds(piece);
    }

    /**
     * Returns metadata for the real-time debugger.
     *
     * @returns {Record<string, string | number | boolean>} Technical debugging data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            width: this.width,
            height: this.height,
            activeCells: this._grid.flat().filter(cell => cell.value > 0).length,
        };
    }

    serialize(): string {
        return JSON.stringify({
            grid: this._grid,
        });
    }

    deserialize(data: string): void {
        const parsed = JSON.parse(data);
        this._grid = parsed.grid;
    }
}
