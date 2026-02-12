import { Color } from './enums';

/**
 *
 * Represents a game's display cell
 *
 * @interface
 */
export type Cell = {
    /** Cell's value, if it's equal to 0 then it is off */
    value: number;
    color: Color;
    coordinate: Coordinate;
};

/**
 * Interface representing a 2D vector with x and y components.
 *
 * @interface
 */
export type Vector = {
    x: number;
    y: number;
};

/**
 *
 * Represents a 2D coordinate.
 *
 * @interface
 */
export type Coordinate = {
    x: number;
    y: number;
};

/**
 * Interface representing the display metrics.
 *
 * @interface
 */
export interface DisplayMetrics {
    display: {
        width: number;
        height: number;
        origin: Coordinate;
    };
    hud: {
        width: number;
        height: number;
        origin: Coordinate;
    };
    cell: {
        size: number;
    };
}
