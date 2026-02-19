import { Grid } from '../../../types/modules';
import CellHelper from '../../../helpers/CellHelper';

/**
 * Handles line-based operations (rows and columns) on the grid.
 */
export default class GridLineEngine {
    constructor(private grid: Grid) {}

    /**
     * Checks if every cell in a specific row is active.
     */
    isRowFull(y: number): boolean {
        const gridData = this.grid.getGrid();
        if (y < 0 || y >= this.grid.height) return false;
        return gridData[y].every(cell => cell.value > 0);
    }

    /**
     * Checks if every cell in a specific row is inactive.
     */
    isRowEmpty(y: number): boolean {
        const gridData = this.grid.getGrid();
        if (y < 0 || y >= this.grid.height) return true;
        return gridData[y].every(cell => cell.value === 0);
    }

    /**
     * Resets all cells in a specific row to their default empty state.
     */
    clearRow(y: number): void {
        const gridData = this.grid.getGrid();
        if (y < 0 || y >= this.grid.height) return;
        for (let x = 0; x < this.grid.width; x++) {
            gridData[y][x] = CellHelper.emptyCell({ x, y });
        }
    }

    /**
     * Shifts all rows above a certain index down by one position.
     */
    shiftRowsDown(fromY: number): void {
        const gridData = this.grid.getGrid();
        for (let y = fromY; y > 0; y--) {
            for (let x = 0; x < this.grid.width; x++) {
                const prevCell = gridData[y - 1][x];
                gridData[y][x].value = prevCell.value;
                gridData[y][x].color = prevCell.color;
            }
        }
        this.clearRow(0);
    }

    /**
     * Shifts all rows below a certain index up by one position.
     */
    shiftRowsUp(fromY: number): void {
        const gridData = this.grid.getGrid();
        for (let y = fromY; y < this.grid.height - 1; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const nextCell = gridData[y + 1][x];
                gridData[y][x].value = nextCell.value;
                gridData[y][x].color = nextCell.color;
            }
        }
        this.clearRow(this.grid.height - 1);
    }

    /**
     * Scans for full rows, clears them, and shifts remaining rows down.
     */
    clearFullRows(): number {
        let rowsCleared = 0;
        for (let y = this.grid.height - 1; y >= 0; y--) {
            if (this.isRowFull(y)) {
                this.clearRow(y);
                this.shiftRowsDown(y);
                rowsCleared++;
                y++; // Re-check the same row index after shifting
            }
        }
        return rowsCleared;
    }

    /**
     * Checks if every cell in a specific column is active.
     */
    isColumnFull(x: number): boolean {
        const gridData = this.grid.getGrid();
        if (x < 0 || x >= this.grid.width) return false;
        for (let y = 0; y < this.grid.height; y++) {
            if (gridData[y][x].value === 0) return false;
        }
        return true;
    }

    /**
     * Checks if every cell in a specific column is inactive.
     */
    isColumnEmpty(x: number): boolean {
        const gridData = this.grid.getGrid();
        if (x < 0 || x >= this.grid.width) return true;
        for (let y = 0; y < this.grid.height; y++) {
            if (gridData[y][x].value !== 0) return false;
        }
        return true;
    }

    /**
     * Resets all cells in a specific column to their default empty state.
     */
    clearColumn(x: number): void {
        const gridData = this.grid.getGrid();
        if (x < 0 || x >= this.grid.width) return;
        for (let y = 0; y < this.grid.height; y++) {
            gridData[y][x] = CellHelper.emptyCell({ x, y });
        }
    }

    /**
     * Shifts all columns to the left of a certain index one position to the right.
     */
    shiftColumnsRight(fromX: number): void {
        const gridData = this.grid.getGrid();
        for (let x = fromX; x > 0; x--) {
            for (let y = 0; y < this.grid.height; y++) {
                const prevCell = gridData[y][x - 1];
                gridData[y][x].value = prevCell.value;
                gridData[y][x].color = prevCell.color;
            }
        }
        this.clearColumn(0);
    }

    /**
     * Shifts all columns to the right of a certain index one position to the left.
     */
    shiftColumnsLeft(fromX: number): void {
        const gridData = this.grid.getGrid();
        for (let x = fromX; x < this.grid.width - 1; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                const nextCell = gridData[y][x + 1];
                gridData[y][x].value = nextCell.value;
                gridData[y][x].color = nextCell.color;
            }
        }
        this.clearColumn(this.grid.width - 1);
    }

    /**
     * Scans for full columns, clears them, and shifts remaining columns right.
     */
    clearFullColumns(): number {
        let columnsCleared = 0;
        for (let x = this.grid.width - 1; x >= 0; x--) {
            if (this.isColumnFull(x)) {
                this.clearColumn(x);
                this.shiftColumnsRight(x);
                columnsCleared++;
                x++; // Re-check the same column index after shifting
            }
        }
        return columnsCleared;
    }
}
