import RendererContext from '../context/RendererContext';

/**
 * Static utility for calculating pixel values relative to the canvas size.
 * Allows for responsive design by defining sizes as percentages (0.0 - 1.0).
 */
export default class RelativeValuesHelper {
    /**
     * Calculates a pixel width based on a percentage of the canvas width.
     *
     * @param {number} size - The percentage (0.0 to 1.0).
     * @returns {number} The absolute width in pixels.
     */
    static getRelativeWidth(size: number): number {
        const { p } = RendererContext;
        return size * p.width;
    }

    /**
     * Calculates a pixel height based on a percentage of the canvas height.
     *
     * @param {number} size - The percentage (0.0 to 1.0).
     * @returns {number} The absolute height in pixels.
     */
    static getRelativeHeight(size: number): number {
        const { p } = RendererContext;
        return size * p.height;
    }
}
