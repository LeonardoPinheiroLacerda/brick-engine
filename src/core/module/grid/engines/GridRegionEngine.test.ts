import { describe, it, expect, vi, beforeEach } from 'vitest';
import GridRegionEngine from './GridRegionEngine';
import { Grid } from '../../../types/modules';
import { Color } from '../../../types/enums';

describe('GridRegionEngine', () => {
    let engine: GridRegionEngine;
    let mockGrid: Grid;

    beforeEach(() => {
        // [ARRANGE] Mock Grid facade
        mockGrid = {
            width: 10,
            height: 20,
            isValidCoordinate: vi.fn(),
            isCellActive: vi.fn(),
            setCellValue: vi.fn(),
            setCellColor: vi.fn(),
            stampCell: vi.fn(),
        } as unknown as Grid;
        engine = new GridRegionEngine(mockGrid);
    });

    describe('isAreaOccupied', () => {
        it('should return true if any coordinate is out of bounds', () => {
            // [ARRANGE]
            const coords = [
                { x: 0, y: 0 },
                { x: -1, y: 0 },
            ];
            vi.mocked(mockGrid.isValidCoordinate).mockImplementation(c => c.x >= 0);

            // [ACT]
            const result = engine.isAreaOccupied(coords);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return true if any coordinate is already active', () => {
            // [ARRANGE]
            const coords = [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ];
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.isCellActive).mockImplementation(c => c.x === 2);

            // [ACT]
            const result = engine.isAreaOccupied(coords);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false if all coordinates are valid and inactive', () => {
            // [ARRANGE]
            const coords = [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ];
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.isAreaOccupied(coords);

            // [ASSERT]
            expect(result).toBe(false);
        });
    });

    describe('fillArea', () => {
        it('should call setCellValue and setCellColor for every cell in the defined rectangle', () => {
            // [ARRANGE]
            const start = { x: 1, y: 1 };
            const end = { x: 2, y: 2 };
            const value = 5;
            const color = Color.RED;

            // [ACT]
            engine.fillArea(start, end, value, color);

            // [ASSERT]
            // (1,1), (1,2), (2,1), (2,2) -> 4 cells
            expect(mockGrid.setCellValue).toHaveBeenCalledTimes(4);
            expect(mockGrid.setCellValue).toHaveBeenCalledWith({ x: 1, y: 1 }, 5);
            expect(mockGrid.setCellColor).toHaveBeenCalledWith({ x: 1, y: 1 }, Color.RED);
            expect(mockGrid.setCellValue).toHaveBeenCalledWith({ x: 2, y: 2 }, 5);
        });

        it('should handle coordinates provided in reverse order', () => {
            // [ARRANGE]
            const start = { x: 2, y: 2 };
            const end = { x: 1, y: 1 };

            // [ACT]
            engine.fillArea(start, end, 5, Color.RED);

            // [ASSERT]
            expect(mockGrid.setCellValue).toHaveBeenCalledTimes(4);
        });
    });

    describe('stampPiece', () => {
        it('should call grid.stampCell for each cell in the piece', () => {
            // [ARRANGE]
            const piece = [
                { coordinate: { x: 1, y: 1 }, value: 1, color: Color.RED },
                { coordinate: { x: 1, y: 2 }, value: 1, color: Color.RED },
            ];

            // [ACT]
            engine.stampPiece(piece);

            // [ASSERT]
            expect(mockGrid.stampCell).toHaveBeenCalledTimes(2);
            expect(mockGrid.stampCell).toHaveBeenCalledWith(piece[0]);
            expect(mockGrid.stampCell).toHaveBeenCalledWith(piece[1]);
        });
    });

    describe('stampCell', () => {
        it('should delegate to setCellValue and setCellColor', () => {
            // [ARRANGE]
            const cell = { coordinate: { x: 5, y: 5 }, value: 2, color: Color.BLUE };

            // [ACT]
            engine.stampCell(cell);

            // [ASSERT]
            expect(mockGrid.setCellValue).toHaveBeenCalledWith({ x: 5, y: 5 }, 2);
            expect(mockGrid.setCellColor).toHaveBeenCalledWith({ x: 5, y: 5 }, Color.BLUE);
        });
    });
});
