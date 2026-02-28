import { Coordinate } from '../types/Types';
import configs from '../../config/configs';
import RelativeValuesHelper from './RelativeValuesHelper';
import RendererContext from '../context/RendererContext';

/**
 * Static mathematical utility class for coordinate transformations and translations.
 *
 * Centralizes the logic to transition between abstract engine logical models (e.g.
 * the relative 0.0-1.0 coordinate plane or abstract {@link GameGrid} spaces) and
 * the absolute physical layout on screen. It ensures consistency in calculating
 * element sizes dynamically, keeping UI layouts natively responsive to canvas bounds.
 */
export default class CoordinateHelper {
    /**
     * Converts a flat abstract coordinate object into relative screen dimensional scaling.
     *
     * @param {Coordinate} coordinate - The input logical coordinate structure (x, y).
     * @returns {Coordinate} A new coordinate scaled proportionately to the physical base canvas width/height.
     */
    static getRelativeCoordinate(coordinate: Coordinate): Coordinate {
        return {
            x: RelativeValuesHelper.getRelativeWidth(coordinate.x),
            y: RelativeValuesHelper.getRelativeHeight(coordinate.y),
        };
    }

    /**
     * Calculates the absolute `X` pixel position for an element rendered on the Main Display.
     *
     * @param {number} x - The relative or normalized input X horizontal position.
     * @param {number} displayWidth - The dynamically calculated width of the central display area.
     * @returns {number} The absolute horizontal offset pixel coordinate formatted for `p5` rendering functions.
     */
    static getDisplayPosX(x: number, displayWidth: number): number {
        const { margin } = configs.screenLayout.display;

        return displayWidth * x + RelativeValuesHelper.getRelativeWidth(margin);
    }

    /**
     * Calculates the absolute `Y` pixel position for an element rendered on the Main Display.
     *
     * @param {number} y - The relative or normalized input Y vertical position.
     * @param {number} displayHeight - The dynamically calculated height of the central display area.
     * @returns {number} The absolute vertical offset pixel coordinate formatted for `p5` rendering functions.
     */
    static getDisplayPosY(y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;
        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(margin);
    }

    /**
     * Calculates the absolute `X` pixel position for an element docked to the right-side HUD column.
     *
     * Automatically adjusts its starting position by determining where the
     * Main Display ends physically, injecting proper UI margin limits dynamically.
     *
     * @param {number} x - The relative or normalized X position specifically within the bounded HUD compartment.
     * @param {number} displayWidth - The total real width of the central display (used for zero-point alignment calculation).
     * @returns {number} The absolute X horizontal pixel coordinate within the application layout scale.
     */
    static getHudPosX(x: number, displayWidth: number): number {
        const { p } = RendererContext;
        const { margin } = configs.screenLayout.display;
        const widthRel = RelativeValuesHelper.getRelativeWidth(margin);
        const zero = displayWidth + widthRel * 2;
        const width = p.width - zero - widthRel;
        return width * x + zero;
    }

    /**
     * Calculates the absolute `Y` pixel position for an element docked to the right-side HUD column.
     *
     * @param {number} y - The relative or normalized Y position specifically within the bounded HUD compartment.
     * @param {number} displayHeight - The absolute pixel height assigned logically to the central display (used for scaled positioning bounds).
     * @returns {number} The absolute Y vertical pixel coordinate within the application layout scale.
     */
    static getHudPosY(y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;

        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(margin);
    }
}
