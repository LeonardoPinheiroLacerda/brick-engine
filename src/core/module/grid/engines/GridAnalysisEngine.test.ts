import { describe, it, expect, vi, beforeEach } from 'vitest';
import GridAnalysisEngine from './GridAnalysisEngine';
import { Grid } from '../../../types/modules';
import { Color } from '../../../types/enums';

describe('GridAnalysisEngine', () => {
    let engine: GridAnalysisEngine;
    let mockGrid: Grid;

    beforeEach(() => {
        // [ARRANGE] Mock Grid facade
        mockGrid = {
            width: 10,
            height: 20,
            isValidCoordinate: vi.fn(),
            isCellActive: vi.fn(),
            getCell: vi.fn(),
            stampCell: vi.fn(),
        } as unknown as Grid;
        engine = new GridAnalysisEngine(mockGrid);
    });

    describe('getFullRows', () => {
        it('should return indices of rows where all cells are active', () => {
            // [ARRANGE] Row 2 is full, others are not
            vi.mocked(mockGrid.isCellActive).mockImplementation(({ y }) => y === 2);

            // [ACT]
            const result = engine.getFullRows();

            // [ASSERT]
            expect(result).toEqual([2]);
        });

        it('should return an empty array if no rows are full', () => {
            // [ARRANGE]
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.getFullRows();

            // [ASSERT]
            expect(result).toEqual([]);
        });
    });

    describe('getFullColumns', () => {
        it('should return indices of columns where all cells are active', () => {
            // [ARRANGE] Column 5 is full
            vi.mocked(mockGrid.isCellActive).mockImplementation(({ x }) => x === 5);

            // [ACT]
            const result = engine.getFullColumns();

            // [ASSERT]
            expect(result).toEqual([5]);
        });
    });

    describe('getNeighbors', () => {
        it('should return only orthogonally adjacent cells by default', () => {
            // [ARRANGE]
            const coord = { x: 5, y: 5 };
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation(c => ({ coordinate: c, value: 1, color: Color.DEFAULT }));

            // [ACT]
            const result = engine.getNeighbors(coord);

            // [ASSERT]
            expect(result).toHaveLength(4);
            expect(result.map(c => c.coordinate)).toContainEqual({ x: 4, y: 5 });
            expect(result.map(c => c.coordinate)).toContainEqual({ x: 6, y: 5 });
            expect(result.map(c => c.coordinate)).toContainEqual({ x: 5, y: 4 });
            expect(result.map(c => c.coordinate)).toContainEqual({ x: 5, y: 6 });
        });

        it('should return 8 neighbors if includeDiagonal is true', () => {
            // [ARRANGE]
            const coord = { x: 5, y: 5 };
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation(c => ({ coordinate: c, value: 1, color: Color.DEFAULT }));

            // [ACT]
            const result = engine.getNeighbors(coord, true);

            // [ASSERT]
            expect(result).toHaveLength(8);
            expect(result.map(c => c.coordinate)).toContainEqual({ x: 4, y: 4 });
        });

        it('should skip invalid coordinates (e.g., edges)', () => {
            // [ARRANGE] Center at (0,0)
            const coord = { x: 0, y: 0 };
            vi.mocked(mockGrid.isValidCoordinate).mockImplementation(c => c.x >= 0 && c.y >= 0);
            vi.mocked(mockGrid.getCell).mockImplementation(c => ({ coordinate: c, value: 1, color: Color.DEFAULT }));

            // [ACT]
            const result = engine.getNeighbors(coord);

            // [ASSERT]
            // Only (1,0) and (0,1) are valid
            expect(result).toHaveLength(2);
        });
    });

    describe('findConnectedCells', () => {
        it('should return an empty array if starting cell is inactive', () => {
            // [ARRANGE]
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.findConnectedCells({ x: 5, y: 5 });

            // [ASSERT]
            expect(result).toEqual([]);
        });

        it('should find all connected cells with the same value using BFS', () => {
            // [ARRANGE] Simple 2x1 block
            const start = { x: 5, y: 5 };
            const neighbor = { x: 6, y: 5 };

            vi.mocked(mockGrid.isCellActive).mockImplementation(c => (c.x === 5 && c.y === 5) || (c.x === 6 && c.y === 5));
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation(c => ({ coordinate: c, value: 1, color: Color.RED }));

            // [ACT]
            const result = engine.findConnectedCells(start);

            // [ASSERT]
            expect(result).toHaveLength(2);
            expect(result.map(c => c.coordinate)).toContainEqual(start);
            expect(result.map(c => c.coordinate)).toContainEqual(neighbor);
        });
    });

    describe('swapCells', () => {
        it('should swap attributes of two cells using stampCell', () => {
            // [ARRANGE]
            const a = { x: 1, y: 1 };
            const b = { x: 2, y: 2 };
            const cellA = { coordinate: a, value: 1, color: Color.RED };
            const cellB = { coordinate: b, value: 2, color: Color.BLUE };

            vi.mocked(mockGrid.getCell).mockImplementation(c => (c.x === 1 ? cellA : cellB));

            // [ACT]
            engine.swapCells(a, b);

            // [ASSERT]
            // Stamp cellB at a, and cellA at b
            expect(mockGrid.stampCell).toHaveBeenCalledWith({ ...cellB, coordinate: a });
            expect(mockGrid.stampCell).toHaveBeenCalledWith({ ...cellA, coordinate: b });
        });
    });
});
