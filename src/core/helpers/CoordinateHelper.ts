import p5 from 'p5';
import { Coordinate } from '../types/Types';
import configs from '../../config/configs';
import RelativeValuesHelper from './RelativeValuesHelper';

/**
 * Static utility class for coordinate transformations.
 * Handles conversions between relative (0-1) coordinates and absolute pixel positions
 * for both the main display and the HUD.
 */
export default class CoordinateHelper {
    /**
     * Converts a simplified coordinate object to relative screen dimensions.
     *
     * @param {p5} p - The P5 instance.
     * @param {Coordinate} coordinate - The normal coordinate.
     * @returns {Coordinate} A new coordinate scaled to the canvas width/height.
     */
    static getRelativeCoordinate(p: p5, coordinate: Coordinate): Coordinate {
        return {
            x: RelativeValuesHelper.getRelativeWidth(p, coordinate.x),
            y: RelativeValuesHelper.getRelativeHeight(p, coordinate.y),
        };
    }

    /**
     * Calculates the absolute X pixel position for an element on the Main Display.
     *
     * @param {p5} p - The p5 instance.
     * @param {number} x - The relative or normalized X position.
     * @param {number} displayWidth - The calculated width of the display area.
     * @returns {number} The absolute X pixel coordinate.
     */
    static getDisplayPosX(p: p5, x: number, displayWidth: number): number {
        const { margin } = configs.screenLayout.display;

        return displayWidth * x + RelativeValuesHelper.getRelativeWidth(p, margin);
    }

    /**
     * Calculates the absolute Y pixel position for an element on the Main Display.
     *
     * @param {p5} p - The p5 instance.
     * @param {number} y - The relative or normalized Y position.
     * @param {number} displayHeight - The calculated height of the display area.
     * @returns {number} The absolute Y pixel coordinate.
     */
    static getDisplayPosY(p: p5, y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;
        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(p, margin);
    }

    /**
     * Calculates the absolute X pixel position for an element on the HUD.
     * Use this to position elements in the sidebar.
     *
     * @param {p5} p - The p5 instance.
     * @param {number} x - The relative or normalized X position within the HUD.
     * @param {number} displayWidth - The width of the main display (used for offset calculation).
     * @returns {number} The absolute X pixel coordinate.
     */
    static getHudPosX(p: p5, x: number, displayWidth: number): number {
        const { margin } = configs.screenLayout.display;
        const zero = displayWidth + RelativeValuesHelper.getRelativeWidth(p, margin) * 2;
        const width = p.width - zero - RelativeValuesHelper.getRelativeWidth(p, margin);
        return width * x + zero;
    }

    /**
     * Calculates the absolute Y pixel position for an element on the HUD.
     *
     * @param {p5} p - The p5 instance.
     * @param {number} y - The relative or normalized Y position within the HUD.
     * @param {number} displayHeight - The height of the main display (used for scaling).
     * @returns {number} The absolute Y pixel coordinate.
     */
    static getHudPosY(p: p5, y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;

        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(p, margin);
    }
}
