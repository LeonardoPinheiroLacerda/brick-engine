import { describe, it, expect, vi, beforeEach } from 'vitest';
import GridTransformEngine from './GridTransformEngine';
import { Grid } from '../../../types/modules';
import { Color } from '../../../types/enums';

describe('GridTransformEngine', () => {
    let engine: GridTransformEngine;
    let mockGrid: Grid;

    beforeEach(() => {
        // [ARRANGE] Mock Grid facade
        mockGrid = {
            isValidCoordinate: vi.fn(),
            isCellActive: vi.fn(),
        } as unknown as Grid;
        engine = new GridTransformEngine(mockGrid);
    });

    describe('rotatePiece', () => {
        it('should rotate a piece 90 degrees clockwise around origin', () => {
            // [ARRANGE]
            // Origin (5,5), Cell at (5,4) (above)
            // Clockwise rotation should move it to (6,5) (right)
            const piece = [{ coordinate: { x: 5, y: 4 }, value: 1, color: Color.RED }];
            const origin = { x: 5, y: 5 };
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(false);

            // [ACT]
            const result = engine.rotatePiece(piece, origin, true);

            // [ASSERT]
            expect(result).not.toBeNull();
            expect(result![0].coordinate).toEqual({ x: 6, y: 5 });
        });

        it('should return null if rotation results in a collision', () => {
            // [ARRANGE]
            const piece = [{ coordinate: { x: 5, y: 4 }, value: 1, color: Color.RED }];
            const origin = { x: 5, y: 5 };
            vi.mocked(mockGrid.isValidCoordinate).mockReturnValue(true);
            vi.mocked(mockGrid.isCellActive).mockReturnValue(true); // Obstacle at (6,5)

            // [ACT]
            const result = engine.rotatePiece(piece, origin, true);

            // [ASSERT]
            expect(result).toBeNull();
        });
    });

    describe('getPieceBounds', () => {
        it('should return correct min and max coordinates', () => {
            // [ARRANGE]
            const piece = [
                { coordinate: { x: 1, y: 10 }, value: 1, color: Color.RED },
                { coordinate: { x: 5, y: 2 }, value: 1, color: Color.RED },
            ];

            // [ACT]
            const bounds = engine.getPieceBounds(piece);

            // [ASSERT]
            expect(bounds.min).toEqual({ x: 1, y: 2 });
            expect(bounds.max).toEqual({ x: 5, y: 10 });
        });
    });

    describe('mirrorPiece', () => {
        it('should mirror piece across X axis (horizontal mirror)', () => {
            // [ARRANGE]
            // Piece at X: 1, 2, 3. Center is 2.
            // 1 mirrors to 3, 2 stays 2, 3 mirrors to 1.
            const piece = [
                { coordinate: { x: 1, y: 1 }, value: 1, color: Color.RED },
                { coordinate: { x: 3, y: 1 }, value: 1, color: Color.RED },
            ];

            // [ACT]
            const result = engine.mirrorPiece(piece, 'x');

            // [ASSERT]
            expect(result.map(c => c.coordinate.x)).toContain(1);
            expect(result.map(c => c.coordinate.x)).toContain(3);
        });

        it('should handle single cell pieces for mirroring', () => {
            // [ARRANGE]
            const piece = [{ coordinate: { x: 5, y: 5 }, value: 1, color: Color.RED }];

            // [ACT]
            const result = engine.mirrorPiece(piece, 'y');

            // [ASSERT]
            expect(result[0].coordinate).toEqual({ x: 5, y: 5 });
        });
    });
});
