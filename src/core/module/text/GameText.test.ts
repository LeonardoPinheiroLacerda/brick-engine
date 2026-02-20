import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameText from './GameText';
import p5 from 'p5';
import { FontSize, FontAlign, FontVerticalAlign } from '../../types/enums';
import CoordinateHelper from '../../helpers/CoordinateHelper';

// [ARRANGE] Mock CoordinateHelper
vi.mock('../../helpers/CoordinateHelper', () => ({
    default: {
        getHudPosX: vi.fn().mockReturnValue(10),
        getHudPosY: vi.fn().mockReturnValue(20),
        getDisplayPosX: vi.fn().mockReturnValue(30),
        getDisplayPosY: vi.fn().mockReturnValue(40),
    },
}));

describe('GameText', () => {
    let gameText: GameText;
    let mockP5: p5;

    beforeEach(() => {
        mockP5 = {
            textFont: vi.fn(),
            fill: vi.fn(),
            textSize: vi.fn(),
            textAlign: vi.fn(),
            text: vi.fn(),
            width: 1000,
            height: 1000,
        } as unknown as p5;

        gameText = new GameText(mockP5);
        gameText.setRendererMetrics({
            display: { width: 600, height: 900, origin: { x: 0, y: 0 } },
            hud: { width: 400, height: 900, origin: { x: 600, y: 0 } },
            cell: { size: 50 },
        });
    });

    describe('setup', () => {
        it('should set font and calculate font sizes', () => {
            // [ACT]
            gameText.setup();

            // [ASSERT]
            expect(mockP5.textFont).toHaveBeenCalledWith('retro-gamming');
            // Check if some sizes were set (e.g. textSize(FontSize.MEDIUM))
            gameText.setTextSize(FontSize.MEDIUM);
            expect(mockP5.textSize).toHaveBeenCalled();
        });
    });

    describe('Rendering positions', () => {
        beforeEach(() => {
            gameText.setup();
        });

        it('should call CoordinateHelper.getHudPos and p5.text for HUD text', () => {
            // [ACT]
            gameText.textOnHud('Hello', { x: 0.5, y: 0.5 });

            // [ASSERT]
            expect(CoordinateHelper.getHudPosX).toHaveBeenCalled();
            expect(mockP5.text).toHaveBeenCalledWith('Hello', 10, 20);
        });

        it('should call CoordinateHelper.getDisplayPos and p5.text for Display text', () => {
            // [ACT]
            gameText.textOnDisplay('Score', { x: 0.1, y: 0.1 });

            // [ASSERT]
            expect(CoordinateHelper.getDisplayPosX).toHaveBeenCalled();
            expect(mockP5.text).toHaveBeenCalledWith('Score', 30, 40);
        });
    });

    describe('Alignment & Sizing', () => {
        it('should delegate to p5.textAlign and p5.textSize', () => {
            // [ACT]
            gameText.setTextAlign(FontAlign.CENTER, FontVerticalAlign.CENTER);
            gameText.setTextSize(FontSize.LARGE);

            // [ASSERT]
            expect(mockP5.textAlign).toHaveBeenCalledWith(FontAlign.CENTER, FontVerticalAlign.CENTER);
        });
    });
});
