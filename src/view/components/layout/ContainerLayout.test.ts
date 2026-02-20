/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import type p5 from 'p5';
import ContainerLayout from './ContainerLayout';

describe('ContainerLayout', () => {
    it('should calculate dimensions for mobile breakpoint', () => {
        // [ARRANGE]
        const mockElement = { parent: vi.fn(), id: vi.fn() };
        const mockP5 = { createDiv: vi.fn().mockReturnValue(mockElement) } as unknown as p5;
        const mockParent = {
            clientWidth: 500, // Mobile < 600
            clientHeight: 900,
        } as unknown as HTMLElement;

        // [ACT]
        const result = ContainerLayout(mockP5, mockParent);

        // [ASSERT]
        expect(result.width).toBe(500);
        expect(result.height).toBe(900);
        expect(mockElement.id).toHaveBeenCalledWith('container');
    });

    it('should calculate dimensions for desktop with vertical limit', () => {
        // [ARRANGE]
        const mockElement = { parent: vi.fn(), id: vi.fn() };
        const mockP5 = { createDiv: vi.fn().mockReturnValue(mockElement) } as unknown as p5;

        // desktop
        const mockParent = {
            clientWidth: 1200,
            clientHeight: 1000,
        } as unknown as HTMLElement;

        // Multiplier is 1.9 in configs
        // maxHeightWidth = 1000 / (1.9 * 1.05) ≈ 501.25
        // width = min(1200, 501.25) ≈ 501.25
        // height = 501.25 * 1.9 ≈ 952.38

        // [ACT]
        const result = ContainerLayout(mockP5, mockParent);

        // [ASSERT]
        expect(result.width).toBeLessThan(600); // Because vertical limit is tight
        expect(result.height).toBeCloseTo(result.width * 1.9);
    });
});
