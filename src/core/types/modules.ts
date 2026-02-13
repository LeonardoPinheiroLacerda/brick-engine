import P5 from 'p5';
import { Color, ControlKey, FontAlign, FontSize, FontVerticalAlign } from './enums';
import { Initializable } from './Interfaces';
import { Cell, ControlCallback, ControlEventType, Coordinate, RendererMetrics, GameModules, StateProperty } from './Types';

/**
 * Interface for the renderer module.
 */
export interface Renderer extends Initializable {
    /**
     * Renders the grid.
     * @param grid The grid to render.
     */
    render(grid: Cell[][]): void;
}

/**
 * Interface for the composite renderer module.
 */
export interface RendererComposite extends Renderer {
    /**
     * Adds a renderer to the composite renderer.
     * @param renderer The renderer to add.
     */
    addRenderer(renderer: Renderer): void;
    /**
     * The display metrics of the renderer.
     */
    rendererMetrics: RendererMetrics;
}

/**
 * Interface for the text module.
 */
export interface Text extends Initializable {
    /**
     * Sets the display metrics for the text module.
     * @param rendererMetrics The renderer metrics to set.
     */
    setRendererMetrics(rendererMetrics: RendererMetrics): void;
    /**
     * Sets the active text.
     */
    setActiveText(): void;
    /**
     * Sets the inactive text.
     */
    setInactiveText(): void;
    /**
     * Sets the font size for the text module.
     * @param fontSize The font size to set.
     */
    setTextSize(fontSize: FontSize): void;
    /**
     * Sets the text alignment for the text module.
     * @param fontAlign The font alignment to set.
     * @param fontVerticalAlign The font vertical alignment to set.
     */
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void;
    /**
     * Displays text on the HUD.
     * @param text The text to display.
     * @param coordinate The coordinate to display the text at.
     */
    textOnHud(text: string, coordinate: Coordinate): void;
    textOnDisplay(text: string, coordinate: Coordinate): void;
}

/**
 * Interface for the grid module.
 */
export interface Grid extends Initializable {
    /**
     * Gets the grid.
     * @returns The grid.
     */
    getGrid(): Cell[][];
    /**
     * The width of the grid.
     */
    width: number;
    /**
     * The height of the grid.
     */
    height: number;
    /**
     * Resets the grid.
     */
    resetGrid(): void;
    /**
     * Iterates over the grid.
     * @param callback The callback to execute for each cell.
     */
    forEach(callback: (cell: Cell) => void): void;
    /**
     * Checks if a coordinate is valid.
     * @param coordinate The coordinate to check.
     * @returns True if the coordinate is valid, false otherwise.
     */
    isValidCoordinate(coordinate: Coordinate): boolean;
    /**
     * Gets the cell at a specific coordinate.
     * @param coordinate The coordinate to get the cell from.
     * @returns The cell at the specified coordinate.
     */
    getCell(coordinate: Coordinate): Cell | null;
    /**
     * Sets the value of a cell.
     * @param coordinate The coordinate to set the cell value at.
     * @param value The value to set.
     */
    setCellValue(coordinate: Coordinate, value: number): void;
    /**
     * Sets the color of a cell.
     * @param coordinate The coordinate to set the cell color at.
     * @param color The color to set.
     */
    setCellColor(coordinate: Coordinate, color: Color): void;
    /**
     * Checks if a cell is active.
     * @param coordinate The coordinate to check.
     * @returns True if the cell is active, false otherwise.
     */
    isCellActive(coordinate: Coordinate): boolean;
    /**
     * Checks if a cell is inactive.
     * @param coordinate The coordinate to check.
     * @returns True if the cell is inactive, false otherwise.
     */
    isCellInactive(coordinate: Coordinate): boolean;
    /**
     * Checks if a row is full.
     * @param y The y-coordinate of the row.
     * @returns True if the row is full, false otherwise.
     */
    isRowFull(y: number): boolean;
    /**
     * Checks if a row is empty.
     * @param y The y-coordinate of the row.
     * @returns True if the row is empty, false otherwise.
     */
    isRowEmpty(y: number): boolean;
    /**
     * Clears a row.
     * @param y The y-coordinate of the row.
     */
    clearRow(y: number): void;
    /**
     * Shifts rows down.
     * @param fromY The y-coordinate to start shifting from.
     */
    shiftRowsDown(fromY: number): void;
    /**
     * Shifts rows up.
     * @param fromY The y-coordinate to start shifting from.
     */
    shiftRowsUp(fromY: number): void;
    /**
     * Clears full rows.
     * @returns The number of cleared rows.
     */
    clearFullRows(): number;
    /**
     * Checks if a column is full.
     * @param x The x-coordinate of the column.
     * @returns True if the column is full, false otherwise.
     */
    isColumnFull(x: number): boolean;
    /**
     * Checks if a column is empty.
     * @param x The x-coordinate of the column.
     * @returns True if the column is empty, false otherwise.
     */
    isColumnEmpty(x: number): boolean;
    /**
     * Clears a column.
     * @param x The x-coordinate of the column.
     */
    clearColumn(x: number): void;
    /**
     * Shifts columns right.
     * @param fromX The x-coordinate to start shifting from.
     */
    shiftColumnsRight(fromX: number): void;
    /**
     * Shifts columns left.
     * @param fromX The x-coordinate to start shifting from.
     */
    shiftColumnsLeft(fromX: number): void;
    /**
     * Clears full columns.
     * @returns The number of cleared columns.
     */
    clearFullColumns(): number;
    /**
     * Checks if an area is occupied.
     * @param coordinates The coordinates to check.
     * @returns True if the area is occupied, false otherwise.
     */
    isAreaOccupied(coordinates: Coordinate[]): boolean;
    /**
     * Fills an area.
     * @param start The starting coordinate of the area.
     * @param end The ending coordinate of the area.
     * @param value The value to fill the area with.
     * @param color The color to fill the area with.
     */
    fillArea(start: Coordinate, end: Coordinate, value: number, color: Color): void;
    /**
     * Applies a value and color to multiple coordinates simultaneously.
     *
     * Effectively "stamps" a piece's shape onto the static grid.
     *
     * @param {Coordinate[]} coordinates - The list of coordinates to update.
     * @param {number} value - The status value to apply.
     * @param {Color} color - The color to apply.
     * @returns {void}
     */
    stampPiece(coordinates: Coordinate[], value: number, color: Color): void;
}

/**
 * Manages the core boolean states of the game and handles state-change events.
 *
 * Provides a central hub for tracking game lifecycle states (on, running, gameOver)
 * and user preferences (color enabled), with persistence support.
 *
 * @interface
 */
export interface State extends Initializable {
    /**
     * Whether the game system is "on" or "powered up".
     *
     * @type {boolean}
     */
    on: boolean;

    /**
     * Whether a game session has started.
     *
     * @type {boolean}
     */
    start: boolean;

    /**
     * Whether a game is currently in progress (active tick).
     *
     * @type {boolean}
     */
    running: boolean;

    /**
     * Whether the game has reached a game over state.
     *
     * @type {boolean}
     */
    gameOver: boolean;

    /**
     * Whether color rendering is enabled in the game.
     * Persistent across sessions.
     *
     * @type {boolean}
     */
    colorEnabled: boolean;

    /**
     * Whether audio is muted.
     *
     * @type {boolean}
     */
    muted: boolean;

    /**
     * Subscribes to changes in specific state properties.
     *
     * @param {string} property - The state property to monitor (e.g., 'on', 'running').
     * @param {function(boolean): void} callback - The function to execute when the property changes.
     * @returns {void}
     */
    subscribe(property: StateProperty, callback: (value: boolean) => void): void;

    /**
     * Unsubscribes from changes in specific state properties.
     *
     * @param {string} property - The state property to monitor (e.g., 'on', 'running').
     * @param {function(boolean): void} callback - The function to execute when the property changes.
     * @returns {void}
     */
    unsubscribe(property: StateProperty, callback: (value: boolean) => void): void;

    /** Toggles the 'on' state. */
    toggleOn(): void;
    /** Toggles the 'start' state. */
    toggleStart(): void;
    /** Toggles the 'running' state. */
    toggleRunning(): void;
    /** Toggles the 'gameOver' state. */
    toggleGameOver(): void;
    /** Toggles the 'colorEnabled' state. */
    toggleColorEnabled(): void;
    /** Toggles the 'muted' state. */
    toggleMuted(): void;
}

/**
 * Interface for the control module.
 */
export interface Control extends Initializable {
    /**
     * Triggers a control event. Used by input drivers (Keyboard, UI).
     * @param key The key to trigger.
     * @param type The event type ('pressed', 'held', 'released').
     */
    notify(key: ControlKey, type: ControlEventType): void;

    /**
     * Sets the modules required for the GameEvent context.
     * @param modules The game modules.
     */
    setModules(modules: GameModules): void;

    /**
     * Subscribes to a control event.
     * @param key The key to listen for.
     * @param type The event type ('pressed', 'held', 'released').
     * @param callback The function to call when the event occurs, receiving the game event info.
     */
    subscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Unsubscribes from a control event.
     * @param key The key to stop listening for.
     * @param type The event type.
     * @param callback The function to remove.
     */
    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;
}

/**
 * Interface for the time module.
 */
export interface Time extends Initializable {
    /**
     * Updates the time accumulator.
     * @param deltaTime Time elapsed since last frame in milliseconds.
     */
    update(deltaTime: number): void;

    /**
     * Checks if enough time has passed for a game tick.
     * @returns True if a tick should occur.
     */
    shouldTick(): boolean;

    /**
     * Resets the time accumulator.
     */
    reset(): void;

    /**
     * Sets the tick interval.
     * @param interval The new tick interval in milliseconds.
     */
    tickInterval: number;

    /**
     * Increments the tick interval.
     * @param amount The amount to increment the tick interval by.
     */
    incrementTickInterval(amount: number): void;

    /**
     * Decrements the tick interval.
     * @param amount The amount to decrement the tick interval by.
     */
    decrementTickInterval(amount: number): void;

    /**
     * Renders performance information overlay.
     * @param p The P5 instance to render with.
     */
    renderPerformance(p: P5): void;
}

/**
 * Interface for the time performance module.
 */
export interface TimePerformance {
    /**
     * Whether the performance overlay is enabled.
     */
    enabled: boolean;

    /**
     * Updates the performance module logic (e.g. TPS calculation).
     * @param deltaTime Time elapsed since last frame.
     */
    update(deltaTime: number): void;

    /**
     * Logs a game tick for TPS measurement.
     */
    logTick(): void;

    /**
     * Renders the performance overlay.
     * @param p The P5 instance.
     * @param tickInterval The current tick interval.
     */
    render(p: P5, tickInterval: number): void;
}
