import Color from '../enum/Color';

/**
 *
 * Used as argument to draw an individual cell
 *
 * @interface
 */
export default interface CellElement {
    w: number;
    h: number;
    posX: number;
    posY: number;
    color: Color;
}
