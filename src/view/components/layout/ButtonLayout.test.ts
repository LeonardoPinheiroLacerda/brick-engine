import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import ButtonLayout from './ButtonLayout';
import RendererContext from '../../../core/context/RendererContext';

describe('ButtonLayout', () => {
    it('should create a hierarchy of containers with correct IDs', () => {
        // [ARRANGE]
        const mockElement = {
            parent: vi.fn(),
            id: vi.fn(),
        };
        const mockP5 = {
            createDiv: vi.fn().mockReturnValue(mockElement),
        } as unknown as p5;
        const mockContainer = {} as p5.Element;

        // [ACT]
        RendererContext.reset();
        RendererContext.init(mockP5 as unknown as p5);
        const result = ButtonLayout(mockContainer);

        // [ASSERT]
        expect(mockP5.createDiv).toHaveBeenCalledTimes(8); // buttonContainer, small, inner, medium, vertical, horizontal, large, trackpad
        expect(mockElement.id).toHaveBeenCalledWith('button-container');
        expect(mockElement.id).toHaveBeenCalledWith('small-button-container');
        expect(mockElement.id).toHaveBeenCalledWith('large-button-container');
        expect(result.smallButtonContainer).toBe(mockElement);
        expect(result.largeButtonContainer).toBe(mockElement);
    });
});
