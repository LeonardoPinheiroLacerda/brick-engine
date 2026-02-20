import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import Button from './Button';

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
        const result = Button(mockP5, mockContainer, 'UP');

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
