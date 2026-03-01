import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import FrameLayout from './FrameLayout';
import RendererContext from '../../../core/context/RendererContext';

describe('FrameLayout', () => {
    it('should create a frame with branding text', () => {
        // [ARRANGE]
        const mockElement = { parent: vi.fn(), id: vi.fn() };
        const mockP5 = {
            createDiv: vi.fn().mockReturnValue(mockElement),
            createP: vi.fn().mockReturnValue(mockElement),
        } as unknown as p5;
        const mockContainer = {} as p5.Element;

        // [ACT]
        RendererContext.reset();
        RendererContext.init(mockP5 as unknown as p5);
        const result = FrameLayout(mockContainer);

        // [ASSERT]
        expect(mockP5.createDiv).toHaveBeenCalledTimes(2);
        expect(mockP5.createP).toHaveBeenCalledWith('Brick Engine');
        expect(mockElement.id).toHaveBeenCalledWith('frame');
        expect(result).toBe(mockElement);
    });
});
