import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import Canvas from './Canvas';
import RendererContext from '../../../core/context/RendererContext';

describe('Canvas', () => {
    it('should create a canvas with calculated dimensions from configs', () => {
        // [ARRANGE]
        const mockElement = {
            parent: vi.fn(),
            id: vi.fn(),
        };
        const mockP5 = {
            createCanvas: vi.fn().mockReturnValue(mockElement),
        } as unknown as p5;
        const mockContainer = {} as p5.Element;

        // Ratios from actual configs: widthRatio: 0.7, aspectRatio: 1.114
        const width = 500;
        const expectedWidth = 500 * 0.7; // 350
        const expectedHeight = expectedWidth * 1.114; // 389.9

        // [ACT]
        RendererContext.reset();
        RendererContext.init(mockP5 as unknown as p5);
        const result = Canvas(mockContainer, width);

        // [ASSERT]
        expect(mockP5.createCanvas).toHaveBeenCalledWith(expectedWidth, expectedHeight);
        expect(mockElement.parent).toHaveBeenCalledWith(mockContainer);
        expect(mockElement.id).toHaveBeenCalledWith('brick-game-canvas');
        expect(result.canvasWidth).toBe(expectedWidth);
        expect(result.canvasHeight).toBe(expectedHeight);
    });
});
