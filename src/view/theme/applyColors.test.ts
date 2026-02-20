/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import applyColors from './applyColors';

describe('applyColors', () => {
    let root: HTMLElement;

    beforeEach(() => {
        // Setup JSDOM :root element styles
        root = document.documentElement;
        root.style.cssText = '';

        // Default location mock
        vi.stubGlobal('location', {
            href: 'http://localhost/',
        });
    });

    it('should apply default colors when no query params are present', () => {
        // [ACT]
        applyColors();

        // [ASSERT]
        // Default bodyMain is rgb(0, 68, 187)
        expect(root.style.getPropertyValue('--main-color')).toBe('rgb(0, 68, 187)');
        expect(root.style.getPropertyValue('--button-color')).toBe('rgb(247, 222, 57)');
    });

    it('should apply colors from query parameters', () => {
        // [ARRANGE]
        // body-color and button-color are the keys in configs
        vi.stubGlobal('location', {
            href: 'http://localhost/?body-color=%23ff0000&button-color=%2300ff00',
        });

        // [ACT]
        applyColors();

        // [ASSERT]
        // JSDOM might return rgb(255, 0, 0) for #ff0000
        const mainColor = root.style.getPropertyValue('--main-color');
        expect(mainColor === '#ff0000' || mainColor === 'rgb(255, 0, 0)').toBe(true);

        const buttonColor = root.style.getPropertyValue('--button-color');
        expect(buttonColor === '#00ff00' || buttonColor === 'rgb(0, 255, 0)').toBe(true);
    });
});
