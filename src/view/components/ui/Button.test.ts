import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import Button from './Button';
import RendererContext from '../../../core/context/RendererContext';

describe('Button', () => {
    it('should create a button with requested label and classes', () => {
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
        const result = Button(mockContainer, 'UP');

        // [ASSERT]
        expect(mockP5.createDiv).toHaveBeenCalled();
        expect(mockP5.createButton).toHaveBeenCalledWith('UP');
        expect(mockElement.parent).toHaveBeenCalledWith(mockContainer); // Div parent
        expect(mockElement.parent).toHaveBeenCalledWith(mockElement); // Button parent (self-referencing mock)
        expect(mockElement.addClass).toHaveBeenCalledWith('btn-container');
        expect(mockElement.addClass).toHaveBeenCalledWith('btn');
        expect(result).toBe(mockElement);
    });
});
