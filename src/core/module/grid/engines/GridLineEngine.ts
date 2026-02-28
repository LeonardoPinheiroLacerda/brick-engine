import { Grid } from '../../../types/modules';
import CellHelper from '../../../helpers/CellHelper';

/**
 * Engineering sub-module handling comprehensive shifting row operations and grid clearance.
 *
 * Implements the {@link Grid} structural line shifts. It drives heavy multi-cell displacement,
 * manipulating memory locations explicitly when the engine demands sweeping block changes
 * to simulate gravity or clean completely occupied board bounds.
 */
export default class GridLineEngine {
    constructor(private grid: Grid) {}

    /**
     * Executes horizontal sweeping verifying no static empty elements disrupt a physical row footprint.
     *
     * @param {number} y - The integer declaring the horizontal map layer mapped to height.
     * @returns {boolean} A boolean true if density confirms completely loaded limits.
     */
    isRowFull(y: number): boolean {
        const gridData = this.grid.getGrid();
        if (y < 0 || y >= this.grid.height) return false;
        return gridData[y].every(cell => cell.value > 0);
    }

    /**
     * Executes horizontal sweeping verifying no active elements exist across a physical row footprint.
     *
     * @param {number} y - The integer declaring the horizontal map layer mapped to height.
     * @returns {boolean} A boolean true if all limits check out completely zeroed out.
     */
    isRowEmpty(y: number): boolean {
        const gridData = this.grid.getGrid();
        if (y < 0 || y >= this.grid.height) return true;
        return gridData[y].every(cell => cell.value === 0);
    }

    /**
     * Purges specific memory instances mapping empty metadata objects identically across a row length.
     *
     * @param {number} y - The integer mapped horizontally mapping height to wipe.
     * @returns {void} Returns nothing.
     */
    clearRow(y: number): void {
        const gridData = this.grid.getGrid();
        if (y < 0 || y >= this.grid.height) return;
        for (let x = 0; x < this.grid.width; x++) {
            gridData[y][x] = CellHelper.emptyCell({ x, y });
        }
    }

    /**
     * Transplants memory contents shifting row sequences securely down one numerical grid measure.
     *
     * @param {number} fromY - The explicit target line evaluating continuous transfers upwards.
     * @returns {void} Returns nothing.
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
     * Transplants memory contents shifting row sequences securely up one numerical grid measure.
     *
     * @param {number} fromY - The explicit target line evaluating continuous transfers downwards.
     * @returns {void} Returns nothing.
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
     * Orchestrates comprehensive cascading block removal across multiple overlapping frame steps.
     *
     * @returns {number} The integer metric mapping strictly deleted physical bounds.
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
     * Executes vertical sweeping verifying no static empty elements disrupt a physical column footprint.
     *
     * @param {number} x - The integer declaring the vertical map layer mapped to width.
     * @returns {boolean} A boolean true if density confirms completely loaded limits.
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
     * Executes vertical sweeping verifying no active elements exist across a physical column footprint.
     *
     * @param {number} x - The integer declaring the vertical map layer mapped to width.
     * @returns {boolean} A boolean true if all limits check out completely zeroed out.
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
     * Purges specific memory instances mapping empty metadata objects identically across a column length.
     *
     * @param {number} x - The integer mapped vertically mapping width to wipe.
     * @returns {void} Returns nothing.
     */
    clearColumn(x: number): void {
        const gridData = this.grid.getGrid();
        if (x < 0 || x >= this.grid.width) return;
        for (let y = 0; y < this.grid.height; y++) {
            gridData[y][x] = CellHelper.emptyCell({ x, y });
        }
    }

    /**
     * Transplants memory contents shifting column sequences securely right one numerical grid measure.
     *
     * @param {number} fromX - The explicit target line evaluating continuous transfers.
     * @returns {void} Returns nothing.
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
     * Transplants memory contents shifting column sequences securely left one numerical grid measure.
     *
     * @param {number} fromX - The explicit target line evaluating continuous transfers.
     * @returns {void} Returns nothing.
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
     * Orchestrates comprehensive cascading block removal across multiple overlapping frame steps on columns.
     *
     * @returns {number} The integer metric mapping strictly deleted physical bounds.
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
