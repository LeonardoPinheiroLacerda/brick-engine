import { describe, it, expect, beforeEach } from 'vitest';
import GameGrid from './GameGrid';
import { Color } from '../../types/enums';
import CellHelper from '../../helpers/CellHelper';

describe('GameGrid', () => {
    let grid: GameGrid;

    beforeEach(() => {
        grid = new GameGrid();
        grid.setup();
    });

    describe('Core & Utilities', () => {
        it('should initialize with empty cells', () => {
            const data = grid.getGrid();
            expect(data.length).toBe(grid.height);
            expect(data[0].length).toBe(grid.width);
            expect(data[0][0].value).toBe(0);
        });

        it('should validate coordinates', () => {
            expect(grid.isValidCoordinate({ x: 0, y: 0 })).toBe(true);
            expect(grid.isValidCoordinate({ x: -1, y: 0 })).toBe(false);
            expect(grid.isValidCoordinate({ x: grid.width, y: 0 })).toBe(false);
        });

        it('should get and set cell values/colors', () => {
            const coord = { x: 5, y: 5 };
            grid.setCellValue(coord, 1);
            grid.setCellColor(coord, Color.RED);

            expect(grid.isCellActive(coord)).toBe(true);
            expect(grid.getCell(coord)?.color).toBe(Color.RED);
        });

        it('should return null for out of bounds cell access', () => {
            expect(grid.getCell({ x: -1, y: 0 })).toBeNull();
        });
    });

    describe('Iteration', () => {
        it('should iterate over all cells', () => {
            let count = 0;
            grid.forEach(() => count++);
            expect(count).toBe(grid.width * grid.height);
        });
    });

    describe('Delegation', () => {
        // We verify that calling grid methods calls the internal engines
        // Since engines are private, we can't easily mock them without reaching into internals
        // but given the implementation, we can just check if the methods exist and work as expected
        // as high-level integration tests.

        it('should clear full rows (delegated to line engine)', () => {
            // Fill a row
            for (let x = 0; x < grid.width; x++) grid.setCellValue({ x, y: 0 }, 1);

            const cleared = grid.clearFullRows();
            expect(cleared).toBe(1);
            expect(grid.isRowEmpty(0)).toBe(true);
        });

        it('should move piece (delegated to movement engine)', () => {
            const piece = [CellHelper.emptyCell({ x: 5, y: 5 })];
            piece[0].value = 1;

            const moved = grid.movePiece(piece, { x: 1, y: 0 });
            expect(moved![0].coordinate).toEqual({ x: 6, y: 5 });
        });
    });

    describe('Debug', () => {
        it('should return correct debug data', () => {
            grid.setCellValue({ x: 0, y: 0 }, 1);
            const debug = grid.getDebugData();
            expect(debug.activeCells).toBe(1);
            expect(debug.width).toBe(grid.width);
            expect(debug.height).toBe(grid.height);
        });
    });
});
