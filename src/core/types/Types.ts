import { Color, ControlKey } from './enums';
import { Control, Grid, RendererComposite, State, Text } from './modules';

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
 * Interface representing the renderer metrics.
 *
 * @interface
 */
export interface RendererMetrics {
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

export type StateProperty = 'on' | 'start' | 'running' | 'gameOver' | 'colorEnabled' | 'muted';

/**
 * Enumerates all available control event types.
 */
export type ControlEventType = 'pressed' | 'held';

/**
 * Interface representing the game modules.
 */
export type GameModules = {
    grid: Grid;
    text: Text;
    state: State;
    control: Control;
    renderer: RendererComposite;
};

/**
 * Interface representing a game event.
 */
export interface GameEvent {
    key: ControlKey;
    type: ControlEventType;
    modules: GameModules;
}

/**
 * Type representing a control callback.
 */
export type ControlCallback = (event: GameEvent) => void;
