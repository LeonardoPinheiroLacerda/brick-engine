import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import BigButton from './BigButton';
import RendererContext from '../../../core/context/RendererContext';

describe('BigButton', () => {
    it('should create a large button with requested label', () => {
        // [ARRANGE]
        const mockElement = {
            parent: vi.fn(),
            addClass: vi.fn(),
        };
        const mockP5 = {
            createDiv: vi.fn().mockReturnValue(mockElement),
            createButton: vi.fn().mockReturnValue(mockElement),
        } as unknown as p5;
        const mockContainer = {} as p5.Element;

        // [ACT]
        RendererContext.reset();
        RendererContext.init(mockP5 as unknown as p5);
        const result = BigButton(mockContainer, 'Action');

        // [ASSERT]
        expect(mockP5.createDiv).toHaveBeenCalled();
        expect(mockP5.createButton).toHaveBeenCalledWith('Action');
        expect(mockElement.addClass).toHaveBeenCalledWith('lg-btn-container');
        expect(mockElement.addClass).toHaveBeenCalledWith('lg-btn');
        expect(result).toBe(mockElement);
    });
});
