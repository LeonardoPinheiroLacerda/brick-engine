import { describe, it, expect, beforeEach, vi } from 'vitest';
import RendererContext from './RendererContext';
import p5 from 'p5';

describe('RendererContext', () => {
    beforeEach(() => {
        RendererContext.reset();
    });

    it('should throw an error if accessed before initialization', () => {
        expect(() => RendererContext.p).toThrowError('RendererContext not initialized yet. Ensure the Game object has been created.');
    });

    it('should return the correct p5 instance after initialization', () => {
        const mockP5 = {} as p5;
        RendererContext.init(mockP5);
        expect(RendererContext.p).toBe(mockP5);
    });

    it('should ignore subsequent initializations and log a warning', () => {
        const mockP5_1 = { id: 1 } as unknown as p5;
        const mockP5_2 = { id: 2 } as unknown as p5;
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        RendererContext.init(mockP5_1);
        RendererContext.init(mockP5_2);

        expect(RendererContext.p).toBe(mockP5_1); // keeps the first one
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('RendererContext is already initialized'));

        consoleSpy.mockRestore();
    });
});
