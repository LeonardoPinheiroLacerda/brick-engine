import { describe, it, expect, beforeEach } from 'vitest';
import p5 from 'p5';
import RelativeValuesHelper from './RelativeValuesHelper';
import RendererContext from '../context/RendererContext';

describe('RelativeValuesHelper', () => {
    // [ARRANGE]
    const mockP5 = {
        width: 1000,
        height: 2000,
    } as unknown as p5;

    beforeEach(() => {
        RendererContext.reset();
        RendererContext.init(mockP5);
    });

    describe('getRelativeWidth', () => {
        it('should return 500 when size is 0.5 and p5.width is 1000', () => {
            // [ACT]
            const result = RelativeValuesHelper.getRelativeWidth(0.5);

            // [ASSERT]
            expect(result).toBe(500);
        });

        it('should return 0 when size is 0', () => {
            // [ACT]
            const result = RelativeValuesHelper.getRelativeWidth(0);

            // [ASSERT]
            expect(result).toBe(0);
        });
    });

    describe('getRelativeHeight', () => {
        it('should return 1000 when size is 0.5 and p5.height is 2000', () => {
            // [ACT]
            const result = RelativeValuesHelper.getRelativeHeight(0.5);

            // [ASSERT]
            expect(result).toBe(1000);
        });

        it('should return 2000 when size is 1', () => {
            // [ACT]
            const result = RelativeValuesHelper.getRelativeHeight(1);

            // [ASSERT]
            expect(result).toBe(2000);
        });
    });
});
