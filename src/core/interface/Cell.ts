import Color from '../enum/Color';
import Coordinate from './Coordinate';

/**
 *
 * Represents a game's display cell
 *
 * @interface
 */
export default interface Cell {
    /**
     * Cell's value, if it's equal to 0 then it is off
     */
    value: number;
    /**
     * The color that should be used for rendering if the colorEnabled is equal to true on the game state property
     */
    color: Color;
    /**
     * The coordinate of the cell
     */
    coordinate: Coordinate;
}
