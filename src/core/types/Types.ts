import { Color, ControlKey, ControlEventType, StateProperty } from './enums';
import { Control, Grid, RendererComposite, Score, SoundModule, State, Text, Time } from './modules';

export { Color, ControlKey, ControlEventType, StateProperty };

/**
 * Represents a single cell within the game grid.
 */
export type Cell = {
    /** The cell's state value. `0` indicates inactive/empty, values > 0 indicate occupancy or type. */
    value: number;
    /** The color of the cell, defined by the {@link Color} enum. */
    color: Color;
    /** The logical grid coordinate of this cell. */
    coordinate: Coordinate;
};

/**
 * Represents a 2D vector with X and Y components.
 * Typically used for dimensions or directions.
 */
export type Vector = {
    /** The X component. */
    x: number;
    /** The Y component. */
    y: number;
};

/**
 * Represents a 2D point in a coordinate system.
 * Typically used for grid positions or normalized screen coordinates.
 */
export type Coordinate = {
    /** The horizontal position. */
    x: number;
    /** The vertical position. */
    y: number;
};

/**
 * Defines the calculated layout metrics for the game renderer.
 * These values are used to position elements on the HTML5 Canvas.
 */
export interface RendererMetrics {
    /** Metrics for the main game display area. */
    display: {
        /** The computed width of the display in pixels. */
        width: number;
        /** The computed height of the display in pixels. */
        height: number;
        /** The top-left origin point of the display relative to the canvas. */
        origin: Coordinate;
    };
    /** Metrics for the Head-Up Display (HUD) area. */
    hud: {
        /** The computed width of the HUD in pixels. */
        width: number;
        /** The computed height of the HUD in pixels. */
        height: number;
        /** The top-left origin point of the HUD relative to the canvas. */
        origin: Coordinate;
    };
    /** Metrics for individual grid cells. */
    cell: {
        /** The computed size (width/height) of a cell in pixels. */
        size: number;
    };
}

/**
 * Aggregates all core engine modules.
 * This object is passed around to allow inter-module communication.
 */
export type GameModules = {
    /** The main game grid module. */
    grid: Grid;
    /** The HUD grid module (usually 4x4 for previews). */
    hudGrid: Grid;
    /** The text rendering module. */
    text: Text;
    /** The game state and lifecycle module. */
    state: State;
    /** The input control module. */
    control: Control;
    /** The main renderer compositor module. */
    renderer: RendererComposite;
    /** The game loop timing module. */
    time: Time;
    /** The audio system module. */
    sound: SoundModule;
    /** The scoring and progression module. */
    score: Score;
};

/**
 * Represents an input event triggered by the Control module.
 */
export interface GameEvent {
    /** The control key associated with the event. */
    key: ControlKey;
    /** The type of event (Pressed or Held). */
    type: ControlEventType;
    /** Reference to the game modules for context-aware callbacks. */
    modules: GameModules;
}

/**
 * Callback function type for handling input events.
 *
 * @param {GameEvent} event - The event data containing key, type, and module access.
 */
export type ControlCallback = (event: GameEvent) => void;
