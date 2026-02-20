/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest';
import dimensions from './dimensions';

describe('dimensions', () => {
    let root: HTMLElement;

    beforeEach(() => {
        root = document.documentElement;
        // Clear properties
        root.style.cssText = '';
    });

    it('should set CSS variables based on input dimensions', () => {
        // [ARRANGE]
        const width = 400;
        const height = 800;
        const canvasWidth = 300;
        const canvasHeight = 600;

        // [ACT]
        dimensions(width, height, canvasWidth, canvasHeight);

        // [ASSERT]
        expect(root.style.getPropertyValue('--width')).toBe('400px');
        expect(root.style.getPropertyValue('--height')).toBe('800px');
        expect(root.style.getPropertyValue('--canvas-width')).toBe('300px');
        expect(root.style.getPropertyValue('--canvas-height')).toBe('600px');

        // Multiplier from configs: 1.9
        // borderRadiusRatio: 0.05 -> 400 * 0.05 = 20px
        expect(root.style.getPropertyValue('--border-radius')).toBe('20px');
    });
});
