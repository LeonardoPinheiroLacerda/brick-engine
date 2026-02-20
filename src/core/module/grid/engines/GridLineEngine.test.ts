import { describe, it, expect, beforeEach } from 'vitest';
import GridLineEngine from './GridLineEngine';
import { Grid } from '../../../types/modules';
import { Color } from '../../../types/enums';
import { Cell } from '../../../types/Types';

describe('GridLineEngine', () => {
    let engine: GridLineEngine;
    let mockGrid: Grid;
    let gridData: Cell[][];

    const createSmallGrid = (w: number, h: number) => {
        const data: Cell[][] = [];
        for (let y = 0; y < h; y++) {
            data[y] = [];
            for (let x = 0; x < w; x++) {
                data[y][x] = { coordinate: { x, y }, value: 0, color: Color.DEFAULT };
            }
        }
        return data;
    };

    beforeEach(() => {
        gridData = createSmallGrid(3, 3);
        mockGrid = {
            width: 3,
            height: 3,
            getGrid: () => gridData,
        } as unknown as Grid;
        engine = new GridLineEngine(mockGrid);
    });

    describe('isRowFull', () => {
        it('should return true if all cells in a row have value > 0', () => {
            // [ARRANGE]
            gridData[1].forEach(c => (c.value = 1));

            // [ACT]
            const result = engine.isRowFull(1);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false if any cell in a row has value 0', () => {
            // [ARRANGE]
            gridData[1][0].value = 1;
            gridData[1][1].value = 0; // one empty

            // [ACT]
            const result = engine.isRowFull(1);

            // [ASSERT]
            expect(result).toBe(false);
        });
    });

    describe('clearRow', () => {
        it('should reset all cells in a row to value 0', () => {
            // [ARRANGE]
            gridData[1].forEach(c => (c.value = 5));

            // [ACT]
            engine.clearRow(1);

            // [ASSERT]
            expect(gridData[1].every(c => c.value === 0)).toBe(true);
        });
    });

    describe('shiftRowsDown', () => {
        it('should copy values from row above and clear top row', () => {
            // [ARRANGE]
            gridData[0][0].value = 9; // top row
            gridData[1][0].value = 0; // target row

            // [ACT]
            engine.shiftRowsDown(1);

            // [ASSERT]
            expect(gridData[1][0].value).toBe(9);
            expect(gridData[0][0].value).toBe(0); // top row cleared
        });
    });

    describe('clearFullRows', () => {
        it('should detect, clear, and shift rows, returning count', () => {
            // [ARRANGE]
            // Row 2 is full
            gridData[2].forEach(c => (c.value = 1));
            // Row 1 has a pattern
            gridData[1][0].value = 7;

            // [ACT]
            const cleared = engine.clearFullRows();

            // [ASSERT]
            expect(cleared).toBe(1);
            expect(gridData[2][0].value).toBe(7); // row 1 shifted to row 2
            expect(gridData[1][0].value).toBe(0); // top row (originally 0 or 1) cleared
        });
    });

    describe('isColumnFull', () => {
        it('should return true if all cells in a column have value > 0', () => {
            // [ARRANGE]
            gridData[0][0].value = 1;
            gridData[1][0].value = 1;
            gridData[2][0].value = 1;

            // [ACT]
            const result = engine.isColumnFull(0);

            // [ASSERT]
            expect(result).toBe(true);
        });
    });

    describe('shiftColumnsRight', () => {
        it('should copy values from left and clear first column', () => {
            // [ARRANGE]
            gridData[0][0].value = 8;

            // [ACT]
            engine.shiftColumnsRight(1);

            // [ASSERT]
            expect(gridData[0][1].value).toBe(8);
            expect(gridData[0][0].value).toBe(0);
        });
    });
});
