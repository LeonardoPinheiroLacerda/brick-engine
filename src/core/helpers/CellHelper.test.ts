import { describe, it, expect } from 'vitest';
import CellHelper from './CellHelper';
import { Color } from '../types/enums';

describe('CellHelper', () => {
    describe('emptyCell', () => {
        it('should create an empty cell with value 0 and default color at the given coordinate', () => {
            // [ARRANGE]
            const coordinate = { x: 10, y: 20 };

            // [ACT]
            const result = CellHelper.emptyCell(coordinate);

            // [ASSERT]
            expect(result).toEqual({
                value: 0,
                color: Color.DEFAULT,
                coordinate: { x: 10, y: 20 },
            });
        });

        it('should maintain the reference to the coordinates provided', () => {
            // [ARRANGE]
            const coordinate = { x: 5, y: 5 };

            // [ACT]
            const result = CellHelper.emptyCell(coordinate);

            // [ASSERT]
            expect(result.coordinate).toBe(coordinate);
        });
    });
});
