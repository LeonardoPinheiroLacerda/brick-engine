import { describe, it, expect, vi, beforeEach } from 'vitest';
import p5 from 'p5';
import CoordinateHelper from './CoordinateHelper';
import RelativeValuesHelper from './RelativeValuesHelper';

// [ARRANGE] Mock dependencies
vi.mock('./RelativeValuesHelper');
vi.mock('../../config/configs', () => ({
    default: {
        screenLayout: {
            display: {
                margin: 0.05,
            },
        },
    },
}));

describe('CoordinateHelper', () => {
    const mockP5 = {
        width: 1000,
        height: 2000,
    } as unknown as p5;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getRelativeCoordinate', () => {
        it('should scale coordinates using RelativeValuesHelper', () => {
            // [ARRANGE]
            const coord = { x: 0.5, y: 0.5 };
            vi.mocked(RelativeValuesHelper.getRelativeWidth).mockReturnValue(500);
            vi.mocked(RelativeValuesHelper.getRelativeHeight).mockReturnValue(1000);

            // [ACT]
            const result = CoordinateHelper.getRelativeCoordinate(mockP5, coord);

            // [ASSERT]
            expect(result).toEqual({ x: 500, y: 1000 });
            expect(RelativeValuesHelper.getRelativeWidth).toHaveBeenCalledWith(mockP5, 0.5);
            expect(RelativeValuesHelper.getRelativeHeight).toHaveBeenCalledWith(mockP5, 0.5);
        });
    });

    describe('getDisplayPosX', () => {
        it('should calculate absolute X with margin', () => {
            // [ARRANGE]
            const x = 0.5;
            const displayWidth = 600;
            // margin is 0.05 in mock. RelativeWidth(0.05) -> 50
            vi.mocked(RelativeValuesHelper.getRelativeWidth).mockReturnValue(50);

            // [ACT]
            const result = CoordinateHelper.getDisplayPosX(mockP5, x, displayWidth);

            // [ASSERT]
            // result = 600 * 0.5 + 50 = 350
            expect(result).toBe(350);
            expect(RelativeValuesHelper.getRelativeWidth).toHaveBeenCalledWith(mockP5, 0.05);
        });
    });

    describe('getDisplayPosY', () => {
        it('should calculate absolute Y with margin', () => {
            // [ARRANGE]
            const y = 0.5;
            const displayHeight = 1000;
            vi.mocked(RelativeValuesHelper.getRelativeHeight).mockReturnValue(100);

            // [ACT]
            const result = CoordinateHelper.getDisplayPosY(mockP5, y, displayHeight);

            // [ASSERT]
            // result = 1000 * 0.5 + 100 = 600
            expect(result).toBe(600);
            expect(RelativeValuesHelper.getRelativeHeight).toHaveBeenCalledWith(mockP5, 0.05);
        });
    });

    describe('getHudPosX', () => {
        it('should calculate absolute X for HUD', () => {
            // [ARRANGE]
            const x = 0.5;
            const displayWidth = 600;
            // zero = displayWidth + margin*2 = 600 + 50*2 = 700
            // width = p.width - zero - margin = 1000 - 700 - 50 = 250
            // result = 250 * 0.5 + 700 = 125 + 700 = 825
            vi.mocked(RelativeValuesHelper.getRelativeWidth).mockReturnValue(50);

            // [ACT]
            const result = CoordinateHelper.getHudPosX(mockP5, x, displayWidth);

            // [ASSERT]
            expect(result).toBe(825);
        });
    });

    describe('getHudPosY', () => {
        it('should calculate absolute Y for HUD (same logic as display)', () => {
            // [ARRANGE]
            const y = 0.1;
            const displayHeight = 1000;
            vi.mocked(RelativeValuesHelper.getRelativeHeight).mockReturnValue(100);

            // [ACT]
            const result = CoordinateHelper.getHudPosY(mockP5, y, displayHeight);

            // [ASSERT]
            // 1000 * 0.1 + 100 = 200
            expect(result).toBe(200);
        });
    });
});
