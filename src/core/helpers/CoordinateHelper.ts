import { Coordinate } from '../types/Types';
import configs from '../../config/configs';
import RelativeValuesHelper from './RelativeValuesHelper';
import RendererContext from '../context/RendererContext';

/**
 * Static utility class for coordinate transformations.
 * Handles conversions between relative (0-1) coordinates and absolute pixel positions
 * for both the main display and the HUD.
 */
export default class CoordinateHelper {
    /**
     * Converts a simplified coordinate object to relative screen dimensions.
     *
     * @param {Coordinate} coordinate - The normal coordinate.
     * @returns {Coordinate} A new coordinate scaled to the canvas width/height.
     */
    static getRelativeCoordinate(coordinate: Coordinate): Coordinate {
        return {
            x: RelativeValuesHelper.getRelativeWidth(coordinate.x),
            y: RelativeValuesHelper.getRelativeHeight(coordinate.y),
        };
    }

    /**
     * Calculates the absolute X pixel position for an element on the Main Display.
     *
     * @param {number} x - The relative or normalized X position.
     * @param {number} displayWidth - The calculated width of the display area.
     * @returns {number} The absolute X pixel coordinate.
     */
    static getDisplayPosX(x: number, displayWidth: number): number {
        const { margin } = configs.screenLayout.display;

        return displayWidth * x + RelativeValuesHelper.getRelativeWidth(margin);
    }

    /**
     * Calculates the absolute Y pixel position for an element on the Main Display.
     *
     * @param {number} y - The relative or normalized Y position.
     * @param {number} displayHeight - The calculated height of the display area.
     * @returns {number} The absolute Y pixel coordinate.
     */
    static getDisplayPosY(y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;
        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(margin);
    }

    /**
     * Calculates the absolute X pixel position for an element on the HUD.
     * Use this to position elements in the sidebar.
     *
     * @param {number} x - The relative or normalized X position within the HUD.
     * @param {number} displayWidth - The width of the main display (used for offset calculation).
     * @returns {number} The absolute X pixel coordinate.
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
     * Calculates the absolute Y pixel position for an element on the HUD.
     *
     * @param {number} y - The relative or normalized Y position within the HUD.
     * @param {number} displayHeight - The height of the main display (used for scaling).
     * @returns {number} The absolute Y pixel coordinate.
     */
    static getHudPosY(y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;

        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(margin);
    }
}
