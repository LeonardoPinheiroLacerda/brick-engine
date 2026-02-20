import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import SmallButton from './SmallButton';

describe('SmallButton', () => {
    it('should create a small button with paragraph label', () => {
        // [ARRANGE]
        const mockElement = {
            parent: vi.fn(),
            addClass: vi.fn(),
        };
        const mockP5 = {
            createDiv: vi.fn().mockReturnValue(mockElement),
            createButton: vi.fn().mockReturnValue(mockElement),
            createP: vi.fn().mockReturnValue(mockElement),
        } as unknown as p5;
        const mockContainer = {} as p5.Element;

        // [ACT]
        const result = SmallButton(mockP5, mockContainer, 'Reset', true);

        // [ASSERT]
        expect(mockP5.createDiv).toHaveBeenCalled();
        expect(mockP5.createButton).toHaveBeenCalledWith('');
        expect(mockP5.createP).toHaveBeenCalledWith('Reset');
        expect(mockElement.addClass).toHaveBeenCalledWith('sm-btn-container');
        expect(mockElement.addClass).toHaveBeenCalledWith('sm-btn-container-top');
        expect(mockElement.addClass).toHaveBeenCalledWith('sm-btn');
        expect(mockElement.addClass).toHaveBeenCalledWith('sm-btn-p');
        expect(result).toBe(mockElement);
    });

    it('should use bottom class when top is false', () => {
        // [ARRANGE]
        const mockElement = { parent: vi.fn(), addClass: vi.fn() };
        const mockP5 = {
            createDiv: vi.fn().mockReturnValue(mockElement),
            createButton: vi.fn().mockReturnValue(mockElement),
            createP: vi.fn().mockReturnValue(mockElement),
        } as unknown as p5;

        // [ACT]
        SmallButton(mockP5, {} as p5.Element, 'Test', false);

        // [ASSERT]
        expect(mockElement.addClass).toHaveBeenCalledWith('sm-btn-container-bottom');
    });
});
