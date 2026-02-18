import p5 from 'p5';

/**
 * Static utility for calculating pixel values relative to the canvas size.
 * Allows for responsive design by defining sizes as percentages (0.0 - 1.0).
 */
export default class RelativeValuesHelper {
    /**
     * Calculates a pixel width based on a percentage of the canvas width.
     *
     * @param {p5} p - The P5 instance.
     * @param {number} size - The percentage (0.0 to 1.0).
     * @returns {number} The absolute width in pixels.
     */
    static getRelativeWidth(p: p5, size: number): number {
        return size * p.width;
    }

    /**
     * Calculates a pixel height based on a percentage of the canvas height.
     *
     * @param {p5} p - The P5 instance.
     * @param {number} size - The percentage (0.0 to 1.0).
     * @returns {number} The absolute height in pixels.
     */
    static getRelativeHeight(p: p5, size: number): number {
        return size * p.height;
    }
}
