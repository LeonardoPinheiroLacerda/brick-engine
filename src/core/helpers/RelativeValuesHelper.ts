import RendererContext from '../context/RendererContext';

/**
 * Static mathematical utility for calculating pixel scalar values relative to the base runtime canvas.
 *
 * Provides isolated layout functions specifically for responsive dimensional
 * generation in drawing or element placement without hardcoding absolute pixels.
 */
export default class RelativeValuesHelper {
    /**
     * Calculates an absolute pixel width length based against the main display context width.
     *
     * @param {number} size - The desired scale fraction bounded between 0.0 and 1.0.
     * @returns {number} The absolute integer or float mapped width scale in physical pixels.
     */
    static getRelativeWidth(size: number): number {
        const { p } = RendererContext;
        return size * p.width;
    }

    /**
     * Calculates an absolute pixel height length based against the main display context height.
     *
     * @param {number} size - The desired scale fraction bounded between 0.0 and 1.0.
     * @returns {number} The absolute integer or float mapped height scale in physical pixels.
     */
    static getRelativeHeight(size: number): number {
        const { p } = RendererContext;
        return size * p.height;
    }
}
