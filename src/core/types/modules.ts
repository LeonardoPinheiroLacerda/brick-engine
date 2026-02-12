import { Color, FontAlign, FontSize, FontVerticalAlign } from './enums';
import { Initializable } from './Interfaces';
import { Cell, Coordinate, DisplayMetrics, StateProperty } from './Types';

export interface Renderer extends Initializable {
    render(grid: Cell[][]): void;
}

export interface RendererComposite extends Renderer {
    addRenderer(renderer: Renderer): void;
    displayMetrics: DisplayMetrics;
}

export interface Text extends Initializable {
    setDisplayMetrics(displayMetrics: DisplayMetrics): void;
    setActiveText(): void;
    setInactiveText(): void;
    setTextSize(fontSize: FontSize): void;
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void;
    textOnHud(text: string, coordinate: Coordinate): void;
    textOnDisplay(text: string, coordinate: Coordinate): void;
}

export interface Grid extends Initializable {
    getGrid(): Cell[][];
    width: number;
    height: number;
    resetGrid(): void;
    forEach(callback: (cell: Cell) => void): void;
    isValidCoordinate(coordinate: Coordinate): boolean;
    getCell(coordinate: Coordinate): Cell | null;
    setCellValue(coordinate: Coordinate, value: number): void;
    setCellColor(coordinate: Coordinate, color: Color): void;
    isCellActive(coordinate: Coordinate): boolean;
    isCellInactive(coordinate: Coordinate): boolean;
    isRowFull(y: number): boolean;
    isRowEmpty(y: number): boolean;
    clearRow(y: number): void;
    shiftRowsDown(fromY: number): void;
    shiftRowsUp(fromY: number): void;
    clearFullRows(): number;
    isColumnFull(x: number): boolean;
    isColumnEmpty(x: number): boolean;
    clearColumn(x: number): void;
    shiftColumnsRight(fromX: number): void;
    shiftColumnsLeft(fromX: number): void;
    clearFullColumns(): number;
    isAreaOccupied(coordinates: Coordinate[]): boolean;
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
