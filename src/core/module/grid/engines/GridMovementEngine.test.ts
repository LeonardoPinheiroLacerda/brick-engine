import { describe, it, expect, vi, beforeEach } from 'vitest';
import GridMovementEngine from './GridMovementEngine';
import { Grid } from '../../../types/modules';
import { Color } from '../../../types/enums';
import { Vector, Coordinate, Cell } from '../../../types/Types';

describe('GridMovementEngine', () => {
    let engine: GridMovementEngine;
    let mockGrid: Grid;

    beforeEach(() => {
        // [ARRANGE] Mock Grid facade
        mockGrid = {
            isCoordinateValid: vi.fn(),
            isCellActive: vi.fn(),
            getCell: vi.fn(),
        } as unknown as Grid;
        engine = new GridMovementEngine(mockGrid);
    });

    describe('movePiece', () => {
        it('should return a new piece shifted in the specified direction', () => {
            // [ARRANGE]
            const piece = [{ coordinate: { x: 5, y: 5 }, value: 1, color: Color.RED }];
            const direction: Vector = { x: 1, y: 0 };
            vi.mocked(mockGrid.isCoordinateValid).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation((c: Coordinate) => ({ coordinate: c, value: 0, color: Color.DEFAULT }) as Cell);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.movePiece(piece, direction);

            // [ASSERT]
            expect(result).not.toBe(piece);
            expect(result[0].coordinate).toEqual({ x: 6, y: 5 });
        });

        it('should return original piece if the move is out of bounds', () => {
            // [ARRANGE]
            const piece = [{ coordinate: { x: 0, y: 0 }, value: 1, color: Color.RED }];
            vi.mocked(mockGrid.isCoordinateValid).mockReturnValue(false);

            // [ACT]
            const result = engine.movePieceLeft(piece);

            // [ASSERT]
            expect(result).toBe(piece);
        });

        it('should return original piece if it collides with an active cell that is NOT part of self', () => {
            // [ARRANGE]
            const piece = [{ coordinate: { x: 5, y: 5 }, value: 1, color: Color.RED }];
            vi.mocked(mockGrid.isCoordinateValid).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation((c: Coordinate) => ({ coordinate: c, value: 1, color: Color.RED }) as Cell);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(true); // Obstacle at (6,5)

            // [ACT]
            const result = engine.movePieceRight(piece);

            // [ASSERT]
            expect(result).toBe(piece);
        });

        it('should NOT return original piece if it collides with its own current position (diagonal or overlapping)', () => {
            // [ARRANGE] Piece with 2 cells
            const piece = [
                { coordinate: { x: 5, y: 5 }, value: 1, color: Color.RED },
                { coordinate: { x: 6, y: 5 }, value: 1, color: Color.RED },
            ];
            vi.mocked(mockGrid.isCoordinateValid).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation((c: Coordinate) => ({ coordinate: c, value: 1, color: Color.RED }) as Cell);

            // isCellActive is true for (5,5) and (6,5)
            vi.mocked(mockGrid.isCellActive).mockImplementation((cell: Cell) => cell.coordinate.x === 5 || cell.coordinate.x === 6);

            // [ACT] Move right: (5,5)->(6,5) and (6,5)->(7,5)
            // (6,5) is active, but it matches the original piece's second cell
            const result = engine.movePieceRight(piece);

            // [ASSERT]
            expect(result).not.toBe(piece);
            expect(result[0].coordinate).toEqual({ x: 6, y: 5 });
            expect(result[1].coordinate).toEqual({ x: 7, y: 5 });
        });
    });

    describe('getDropPath', () => {
        it('should return the furthest possible position downwards', () => {
            // [ARRANGE]
            const piece = [{ coordinate: { x: 5, y: 0 }, value: 1, color: Color.RED }];
            vi.mocked(mockGrid.isCoordinateValid).mockImplementation((c: Coordinate) => c.y >= 0 && c.y <= 10);
            vi.mocked(mockGrid.getCell).mockImplementation((c: Coordinate) => ({ coordinate: c, value: 0, color: Color.DEFAULT }) as Cell);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.getDropPath(piece);

            // [ASSERT]
            expect(result[0].coordinate.y).toBe(10);
        });
    });

    describe('moveCell', () => {
        it('should move a single cell if path is clear', () => {
            // [ARRANGE]
            const cell = { coordinate: { x: 1, y: 1 }, value: 1, color: Color.RED };
            vi.mocked(mockGrid.isCoordinateValid).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation((c: Coordinate) => ({ coordinate: c, value: 0, color: Color.DEFAULT }) as Cell);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.moveCellDown(cell);

            // [ASSERT]
            expect(result.coordinate).toEqual({ x: 1, y: 2 });
        });

        it('should return original cell if single cell path is blocked', () => {
            // [ARRANGE]
            const cell = { coordinate: { x: 1, y: 1 }, value: 1, color: Color.RED };
            vi.mocked(mockGrid.isCoordinateValid).mockReturnValue(true);
            vi.mocked(mockGrid.getCell).mockImplementation((c: Coordinate) => ({ coordinate: c, value: 1, color: Color.RED }) as Cell);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(true);

            // [ACT]
            const result = engine.moveCellDown(cell);

            // [ASSERT]
            expect(result).toBe(cell);
        });
    });
});
