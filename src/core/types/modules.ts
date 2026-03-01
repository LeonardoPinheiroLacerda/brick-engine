import p5 from 'p5';
import { Color, ControlKey, FontAlign, FontSize, FontVerticalAlign, Sound, TextTheme } from './enums';
import { Debuggable, Initializable, RendererInitializable, StateSyncable, Serializable } from './Interfaces';
import { Cell, ControlCallback, ControlEventType, Coordinate, RendererMetrics, GameModules, StateProperty, Vector, Piece, Axis } from './Types';

/**
 * Interface for a specific rendering layer.
 * Extensions of this interface implement specific drawing logic (e.g., Grid, HUD).
 */
export interface Renderer extends RendererInitializable {
    /**
     * Renders the visual content for this layer.
     *
     * @param {Cell[][]} grid - The current state of the game grid.
     * @param {GameModules} modules - Access to other engine modules for context (e.g., Score, State).
     * @returns {void} Returns nothing.
     */
    render(grid: Cell[][], modules: GameModules): void;
}

/**
 * Interface for the composite renderer that manages multiple rendering layers.
 */
export interface RendererComposite {
    /**
     * Registers a new renderer layer to the composite system.
     *
     * @param {Renderer} renderer - The renderer instance to add.
     * @returns {void} Returns nothing.
     */
    addRenderer(renderer: Renderer): void;

    /**
     * Orchestrates the rendering process by delegating to all registered renderers.
     *
     * @param {Cell[][]} grid - The current state of the game grid.
     * @param {GameModules} modules - Access to other engine modules.
     * @returns {void} Returns nothing.
     */
    render(grid: Cell[][], modules: GameModules): void;

    /**
     * The calculated display metrics shared across all renderers.
     */
    rendererMetrics: RendererMetrics;
}

/**
 * Interface for the text rendering module.
 * Handles font sizing, alignment, and writing text to relative coordinates.
 */
export interface Text extends Initializable {
    /**
     * Sets the display metrics used for coordinate calculations.
     *
     * @param {RendererMetrics} rendererMetrics - The calculated layout metrics.
     * @returns {void} Returns nothing.
     */
    setRendererMetrics(rendererMetrics: RendererMetrics): void;

    /**
     * Sets the text color to the "active" theme color.
     *
     * @returns {void} Returns nothing.
     */
    setActiveText(): void;

    /**
     * Sets the text color to the "inactive" theme color.
     *
     * @returns {void} Returns nothing.
     */
    setInactiveText(): void;

    /**
     * Sets the text color to a shadow representation, used as half-tone and for depth.
     *
     * @returns {void} Returns nothing.
     */
    setShadowText(): void;

    /**
     * Sets the text color based on the provided text theme state.
     *
     * @param {TextTheme} theme - The desired theme state (ACTIVE, INACTIVE, SHADOW).
     * @returns {void} Returns nothing.
     */
    setTextTheme(theme: TextTheme): void;

    /**
     * Sets the current font size.
     *
     * @param {FontSize} fontSize - The desired size enum value.
     * @returns {void} Returns nothing.
     */
    setTextSize(fontSize: FontSize): void;

    /**
     * Configures the text alignment settings.
     *
     * @param {FontAlign} fontAlign - The horizontal alignment.
     * @param {FontVerticalAlign} fontVerticalAlign - The vertical alignment.
     * @returns {void} Returns nothing.
     */
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void;

    /**
     * Renders text on the HUD area.
     *
     * @param {string} text - The string content to display.
     * @param {Coordinate} coordinate - The normalized position (0.0 to 1.0) within the HUD.
     * @returns {void} Returns nothing.
     */
    textOnHud(text: string, coordinate: Coordinate): void;

    /**
     * Renders text on the main display area.
     *
     * @param {string} text - The string content to display.
     * @param {Coordinate} coordinate - The normalized position (0.0 to 1.0) within the Display.
     * @returns {void} Returns nothing.
     */
    textOnDisplay(text: string, coordinate: Coordinate): void;

    /**
     * Renders a pulsing text on the HUD area based on the elapsed time.
     *
     * @param {string} text - The string content to display.
     * @param {Coordinate} coordinate - The normalized position (0.0 to 1.0) within the HUD.
     * @param {number} elapsedTime - The elapsed time used to calculate the pulse opacity/visibility.
     * @param {number} [pulseSpeedMs] - Time in milliseconds for one full pulse cycle. Default is 1000.
     * @returns {void} Returns nothing.
     */
    pulsingTextOnHud(text: string, coordinate: Coordinate, elapsedTime: number, pulseSpeedMs?: number): void;

    /**
     * Renders a pulsing text on the display area based on the elapsed time.
     *
     * @param {string} text - The string content to display.
     * @param {Coordinate} coordinate - The normalized position (0.0 to 1.0) within the display.
     * @param {number} elapsedTime - The elapsed time used to calculate the pulse opacity/visibility.
     * @param {number} [pulseSpeedMs] - Time in milliseconds for one full pulse cycle. Default is 1000.
     * @returns {void} Returns nothing.
     */
    pulsingTextOnDisplay(text: string, coordinate: Coordinate, elapsedTime: number, pulseSpeedMs?: number): void;
}

/**
 * Interface for the grid module.
 * Manages the state and manipulation of the game's cell matrix.
 */
export interface Grid extends Initializable {
    /**
     * Retrieves the current 2D grid of cells.
     *
     * @returns {Cell[][]} The matrix of cells.
     */
    getGrid(): Cell[][];

    /** The number of columns in the grid. */
    readonly width: number;

    /** The number of rows in the grid. */
    readonly height: number;

    /** The index of the top-most row (always 0). */
    readonly topRow: number;

    /** The index of the bottom-most row. */
    readonly bottomRow: number;

    /** The index of the left-most column (always 0). */
    readonly leftColumn: number;

    /** The index of the right-most column. */
    readonly rightColumn: number;

    /**
     * Resets the entire grid to its empty state.
     *
     * @returns {void} Returns nothing.
     */
    resetGrid(): void;

    /**
     * Iterates over every cell in the grid.
     *
     * @param {function(Cell): void} callback - The function to execute for each cell.
     * @returns {void} Returns nothing.
     */
    forEach(callback: (cell: Cell) => void): void;

    /**
     * Validates if a coordinate exists within the grid boundaries.
     *
     * @param {Coordinate} coordinate - The coordinate to check.
     * @returns {boolean} `true` if valid, `false` otherwise.
     */
    isCoordinateValid(coordinate: Coordinate): boolean;

    /**
     * Retrieves a cell at a specific location.
     *
     * @param {Coordinate} coordinate - The location of the cell.
     * @returns {Cell | null} The cell object, or `null` if the coordinate is invalid.
     */
    getCell(coordinate: Coordinate): Cell | null;

    /**
     * Sets the state value of a specific cell.
     *
     * @param {Coordinate} coordinate - The target location.
     * @param {number} value - The new value (0 for empty).
     * @returns {void} Returns nothing.
     */
    setCellValue(coordinate: Coordinate, value: number): void;

    /**
     * Sets the color of a specific cell.
     *
     * @param {Coordinate} coordinate - The target location.
     * @param {Color} color - The new color.
     * @returns {void} Returns nothing.
     */
    setCellColor(coordinate: Coordinate, color: Color): void;

    /**
     * Checks if a cell is occupied (value > 0).
     *
     * @param {Cell} cell - The cell to check.
     * @returns {boolean} `true` if active.
     */
    isCellActive(cell: Cell): boolean;

    /**
     * Checks if a cell is empty (value == 0).
     *
     * @param {Cell} cell - The cell to check.
     * @returns {boolean} `true` if inactive.
     */
    isCellInactive(cell: Cell): boolean;

    /**
     * Checks if a specific row is completely full.
     *
     * @param {number} y - The row index.
     * @returns {boolean} `true` if all cells in the row are active.
     */
    isRowFull(y: number): boolean;

    /**
     * Checks if a specific row is completely empty.
     *
     * @param {number} y - The row index.
     * @returns {boolean} `true` if all cells in the row are inactive.
     */
    isRowEmpty(y: number): boolean;

    /**
     * Clears all cells in a specific row.
     *
     * @param {number} y - The row index.
     * @returns {void} Returns nothing.
     */
    clearRow(y: number): void;

    /**
     * Shifts all rows above the specified index down by one.
     *
     * @param {number} fromY - The row index to start from.
     * @returns {void} Returns nothing.
     */
    shiftRowsDown(fromY: number): void;

    /**
     * Shifts all rows below the specified index up by one.
     *
     * @param {number} fromY - The row index to start from.
     * @returns {void} Returns nothing.
     */
    shiftRowsUp(fromY: number): void;

    /**
     * Detects and clears all full rows, shifting the grid accordingly.
     *
     * @returns {number} The count of rows cleared.
     */
    clearFullRows(): number;

    /**
     * Checks if a specific column is completely full.
     *
     * @param {number} x - The column index.
     * @returns {boolean} `true` if all cells in the column are active.
     */
    isColumnFull(x: number): boolean;

    /**
     * Checks if a specific column is completely empty.
     *
     * @param {number} x - The column index.
     * @returns {boolean} `true` if all cells in the column are inactive.
     */
    isColumnEmpty(x: number): boolean;

    /**
     * Clears all cells in a specific column.
     *
     * @param {number} x - The column index.
     * @returns {void} Returns nothing.
     */
    clearColumn(x: number): void;

    /**
     * Shifts all columns to the right of the specified index.
     *
     * @param {number} fromX - The column index to start from.
     * @returns {void} Returns nothing.
     */
    shiftColumnsRight(fromX: number): void;

    /**
     * Shifts all columns to the left of the specified index.
     *
     * @param {number} fromX - The column index to start from.
     * @returns {void} Returns nothing.
     */
    shiftColumnsLeft(fromX: number): void;

    /**
     * Detects and clears all full columns.
     *
     * @returns {number} The count of columns cleared.
     */
    clearFullColumns(): number;

    /**
     * Checks if any of the provided coordinates are occupied.
     *
     * @param {Coordinate[]} coordinates - The list of coordinates to test.
     * @returns {boolean} `true` if any coordinate is active or invalid.
     */
    isAreaOccupied(coordinates: Coordinate[]): boolean;

    /**
     * Fills a rectangular area with a value and color.
     *
     * @param {Coordinate} start - Top-left coordinate.
     * @param {Coordinate} end - Bottom-right coordinate.
     * @param {number} value - The value to fill.
     * @param {Color} color - The color to fill.
     * @returns {void} Returns nothing.
     */
    fillArea(start: Coordinate, end: Coordinate, value: number, color: Color): void;

    /**
     * Updates multiple coordinates simultaneously with their specific values and colors.
     *
     * @param {Piece | Cell[]} cells - The collection of cells to stamp.
     * @returns {void} Returns nothing.
     */
    stampPiece(cells: Piece | Cell[]): void;

    /**
     * Updates a single coordinate with a specific value and color from a Cell.
     *
     * @param {Cell} cell - The cell containing coordinate, value and color.
     * @returns {void} Returns nothing.
     */
    stampCell(cell: Cell): void;

    /**
     * Attempts to move a piece in a given direction.
     *
     * @param {Piece | Cell[]} cells - The current piece coordinates.
     * @param {Vector} direction - The movement vector.
     * @returns {Piece} The new piece.
     */
    movePiece(cells: Piece | Cell[], direction: Vector): Piece;

    /**
     * Attempts to move a piece one unit to the left.
     *
     * @param {Piece | Cell[]} cells - The current piece coordinates.
     * @returns {Piece} The new piece.
     */
    movePieceLeft(cells: Piece | Cell[]): Piece;

    /**
     * Attempts to move a piece one unit to the right.
     *
     * @param {Piece | Cell[]} cells - The current piece coordinates.
     * @returns {Piece} The new piece.
     */
    movePieceRight(cells: Piece | Cell[]): Piece;

    /**
     * Attempts to move a piece one unit up.
     *
     * @param {Piece | Cell[]} cells - The current piece coordinates.
     * @returns {Piece} The new piece.
     */
    movePieceUp(cells: Piece | Cell[]): Piece;

    /**
     * Attempts to move a piece one unit down.
     *
     * @param {Piece | Cell[]} cells - The current piece coordinates.
     * @returns {Piece} The new piece.
     */
    movePieceDown(cells: Piece | Cell[]): Piece;

    /**
     * Attempts to move a single coordinate in a given direction.
     *
     * @param {Cell} cell - The current cell.
     * @param {Vector} direction - The movement vector.
     * @returns {Cell} The new cell.
     */
    moveCell(cell: Cell, direction: Vector): Cell;

    /**
     * Attempts to move a single coordinate one unit to the left.
     *
     * @param {Cell} cell - The current cell.
     * @returns {Cell} The new cell.
     */
    moveCellLeft(cell: Cell): Cell;

    /**
     * Attempts to move a single coordinate one unit to the right.
     *
     * @param {Cell} cell - The current cell.
     * @returns {Cell} The new cell.
     */
    moveCellRight(cell: Cell): Cell;

    /**
     * Attempts to move a single coordinate one unit up.
     *
     * @param {Cell} cell - The current cell.
     * @returns {Cell} The new cell.
     */
    moveCellUp(cell: Cell): Cell;

    /**
     * Attempts to move a single coordinate one unit down.
     *
     * @param {Cell} cell - The current cell.
     * @returns {Cell} The new cell.
     */
    moveCellDown(cell: Cell): Cell;

    /**
     * Attempts to rotate a piece 90 degrees around a specific origin.
     *
     * @param {Piece} piece - The current piece.
     * @param {Coordinate} origin - The center of rotation.
     * @param {boolean} [clockwise=true] - Direction of rotation.
     * @returns {Piece} The new piece.
     */
    rotatePiece(piece: Piece, origin: Coordinate, clockwise?: boolean): Piece;

    /**
     * Identifies all rows that are completely filled with active cells.
     *
     * @returns {number[]} Array of row indices (y).
     */
    getFullRows(): number[];

    /**
     * Identifies all columns that are completely filled with active cells.
     *
     * @returns {number[]} Array of column indices (x).
     */
    getFullColumns(): number[];

    /**
     * Calculates the final resting position of a piece if it were dropped continuously.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its final vertical resting position.
     */
    getDropPath(piece: Piece): Piece;

    /**
     * Calculates the final resting position of a piece if it were moved continuously upwards.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its highest vertical resting position.
     */
    getRisePath(piece: Piece): Piece;

    /**
     * Calculates the final resting position of a piece if it were moved continuously to the left.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its leftmost resting position.
     */
    getReachPathLeft(piece: Piece): Piece;

    /**
     * Calculates the final resting position of a piece if it were moved continuously to the right.
     *
     * @param {Piece} piece - The piece to project.
     * @returns {Piece} The piece at its rightmost resting position.
     */
    getReachPathRight(piece: Piece): Piece;

    /**
     * Returns the active cells adjacent to a specific coordinate.
     *
     * @param {Coordinate} coord - The center coordinate.
     * @param {boolean} [includeDiagonal=false] - Whether to include 8 neighbors or just 4.
     * @returns {Cell[]} List of neighboring cells.
     */
    getNeighbors(coord: Coordinate, includeDiagonal?: boolean): Cell[];

    /**
     * Finds all connected active cells of the same value starting from a specific coordinate.
     *
     * @param {Coordinate} coord - Starting coordinate.
     * @returns {Piece} Collection of connected cells.
     */
    findConnectedCells(coord: Coordinate): Piece;

    /**
     * Mirrors a piece across a specific axis relative to its bounding box.
     *
     * @param {Piece} piece - The piece to mirror.
     * @param {Axis} axis - The axis to flip across.
     * @returns {Piece} The mirrored piece.
     */
    mirrorPiece(piece: Piece, axis: Axis): Piece;

    /**
     * Swaps the values and colors of two cells.
     *
     * @param {Coordinate} a - First coordinate.
     * @param {Coordinate} b - Second coordinate.
     * @returns {void} Returns nothing.
     */
    swapCells(a: Coordinate, b: Coordinate): void;
}

/**
 * Interface for the state module.
 * Represents the central hub for game lifecycle and user preferences.
 */
export interface State extends Initializable {
    /**
     * Checks if the game system is "on" (powered up).
     *
     * @returns {boolean} `true` if the system is on.
     */
    isOn(): boolean;

    /**
     * Checks if the game system is "off" (powered down).
     *
     * @returns {boolean} `true` if the system is off.
     */
    isOff(): boolean;

    /**
     * Checks if a game session has fully started (passed the title screen).
     *
     * @returns {boolean} `true` if gameplay is active or paused.
     */
    isStarted(): boolean;

    /**
     * Checks if the game is currently efficiently playing (logic is updating).
     *
     * @returns {boolean} `true` if playing (not paused).
     */
    isPlaying(): boolean;

    /**
     * Checks if the game is paused.
     *
     * @returns {boolean} `true` if started but not playing.
     */
    isPaused(): boolean;

    /**
     * Checks if the game is in a game over state.
     *
     * @returns {boolean} `true` if the game ended.
     */
    isGameOver(): boolean;

    /**
     * Checks if color rendering is enabled.
     *
     * @returns {boolean} `true` if colors are enabled.
     */
    isColorEnabled(): boolean;

    /**
     * Sets the color rendering preference.
     *
     * @param {boolean} value - The new state.
     * @returns {void} Returns nothing.
     */
    setColorEnabled(value: boolean): void;

    /**
     * Checks if audio is globally muted.
     *
     * @returns {boolean} `true` if muted.
     */
    isMuted(): boolean;

    /**
     * Sets the master mute state.
     *
     * @param {boolean} value - The new mute state.
     * @returns {void} Returns nothing.
     */
    setMuted(value: boolean): void;

    /**
     * Subscribes to changes in a specific state property.
     *
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    subscribe(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Unsubscribes a callback from a specific state property.
     *
     * @param {StateProperty} property - The state property being monitored.
     * @param {function(boolean | number): void} callback - The callback reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribe(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Registers a callback for a specific state change ONLY during the title screen.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    subscribeForTitleScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Removes an existing title screen subscription.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    unsubscribeForTitleScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Registers a callback for a specific state change ONLY during the game over screen.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    subscribeForGameOverScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Removes an existing game over screen subscription.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    unsubscribeForGameOverScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Registers a callback for a specific state change ONLY during active gameplay.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    subscribeForPlayingScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Removes an existing playing screen subscription.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    unsubscribeForPlayingScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Registers a callback for a specific state change ONLY during the paused screen.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    subscribeForPausedScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Removes an existing paused screen subscription.
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     * @returns {void} Returns nothing.
     */
    unsubscribeForPausedScreen(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Turn the game system on.
     * @returns {void} Returns nothing.
     */
    turnOn(): void;

    /**
     * Turn the game system off.
     * @returns {void} Returns nothing.
     */
    turnOff(): void;

    /**
     * Initiate a new game (transition from Title Screen to Gameplay).
     * @returns {void} Returns nothing.
     */
    startGame(): void;

    /**
     * Exit the current game session (transition to Title Screen).
     * @returns {void} Returns nothing.
     */
    exitGame(): void;

    /**
     * Pause the current game logic.
     * @returns {void} Returns nothing.
     */
    pause(): void;

    /**
     * Resume the game logic from a paused state.
     * @returns {void} Returns nothing.
     */
    resume(): void;

    /**
     * Trigger a game over state.
     * @returns {void} Returns nothing.
     */
    triggerGameOver(): void;

    /**
     * Reset the game state flags for a new round (post-Game Over).
     * @returns {void} Returns nothing.
     */
    resetGame(): void;

    /**
     * Toggles the {@link StateProperty.COLOR_ENABLED} state.
     * @returns {void} Returns nothing.
     */
    toggleColorEnabled(): void;

    /**
     * Toggles the {@link StateProperty.MUTED} state.
     * @returns {void} Returns nothing.
     */
    toggleMuted(): void;

    /**
     * Resets the game over state and starts the game again.
     * @returns {void} Returns nothing.
     */
    resetGameOver(): void;
}

/**
 * Interface for the control module.
 * Manages input handling, binding, and event notification.
 */
export interface Control extends Initializable {
    /**
     * Triggers a control event manually.
     *
     * @param {ControlKey} key - The key identity.
     * @param {ControlEventType} type - The type of event (press/hold).
     * @returns {void} Returns nothing.
     */
    notify(key: ControlKey, type: ControlEventType): void;

    /**
     * Registers a callback for a specific control event.
     *
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function to execute.
     * @returns {void} Returns nothing.
     */
    subscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Removes an existing subscription.
     *
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Registers a callback for a specific control event ONLY during the title screen.
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     * @returns {void} Returns nothing.
     */
    subscribeForTitleScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Removes an existing title screen subscription.
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribeForTitleScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Registers a callback for a specific control event ONLY during the game over screen.
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function to execute.
     * @returns {void} Returns nothing.
     */
    subscribeForGameOverScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Removes an existing game over screen subscription.
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribeForGameOverScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Registers a callback for a specific control event ONLY during active gameplay.
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function to execute.
     * @returns {void} Returns nothing.
     */
    subscribeForPlayingScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Removes an existing playing screen subscription.
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribeForPlayingScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Registers a callback for a specific control event ONLY during the paused screen.
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function to execute.
     * @returns {void} Returns nothing.
     */
    subscribeForPausedScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Removes an existing paused screen subscription.
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     * @returns {void} Returns nothing.
     */
    unsubscribeForPausedScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Injects the module references required for populating the event context.
     *
     * @param {GameModules} modules - The collection of system modules.
     * @returns {void} Returns nothing.
     */
    setModules(modules: GameModules): void;

    /**
     * Detaches all hardware/DOM event listeners.
     *
     * @returns {void} Returns nothing.
     */
    unbindControls(): void;

    /**
     * Attaches all hardware/DOM event listeners.
     *
     * @returns {void} Returns nothing.
     */
    bindControls(): void;
}

/**
 * Interface for the time module.
 * Manages the game loop timing, ticks, and delta time.
 */
export interface Time extends Initializable {
    /** The interval between logic ticks in milliseconds. */
    tickInterval: number;
    /** The total number of ticks since the game started. */
    readonly totalTicks: number;

    /** Total elapsed time in milliseconds since the game started. */
    readonly elapsedTime: number;

    /**
     * Checks if enough time has passed for a game tick based on a specific interval.
     *
     * @param {number} interval - The tick interval to check.
     * @returns {boolean} `true` if the current tick is a multiple of the interval.
     */
    isTickEvery(interval: number): boolean;

    /**
     * Accumulates passed time and calculates FPS/TPS.
     *
     * @param {number} deltaTime - Time elapsed since last frame in milliseconds.
     * @returns {void} Returns nothing.
     */
    update(deltaTime: number): void;

    /**
     * Determines if a logic tick should occur based on the accumulator.
     *
     * @returns {boolean} `true` if a tick is due.
     */
    shouldTick(): boolean;

    /**
     * Resets internal time accumulators and counters.
     *
     * @returns {void} Returns nothing.
     */
    reset(): void;

    /**
     * Increases the tick interval (slowing down the game logic).
     *
     * @param {number} amount - Milliseconds to add.
     * @returns {void} Returns nothing.
     */
    incrementTickInterval(amount: number): void;

    /**
     * Decreases the tick interval (speeding up the game logic).
     *
     * @param {number} amount - Milliseconds to subtract.
     * @returns {void} Returns nothing.
     */
    decrementTickInterval(amount: number): void;

    /**
     * Sets the tick interval.
     *
     * @param {number} interval - The new tick interval in milliseconds.
     * @returns {void} Returns nothing.
     */
    setTickInterval(interval: number): void;

    /**
     * Sets the minimum tick interval.
     *
     * @param {number} interval - The new minimum tick interval in milliseconds.
     * @returns {void} Returns nothing.
     */
    setMinTickInterval(interval: number): void;

    /**
     * Captures the current tick interval as the initial state.
     * Use this after games have set their starting speed.
     *
     * @returns {void} Returns nothing.
     */
    captureInitialState(): void;
}

/**
 * Interface for the audio module.
 */
export interface SoundModule extends Initializable {
    /**
     * Plays a sound effect.
     *
     * @param {Sound} sound - The {@link Sound} enum to play.
     * @returns {Promise<void>} Resolves when playback starts.
     */
    play(sound: Sound): Promise<void>;

    /**
     * Stops all active instances of a specific sound.
     *
     * @param {Sound} sound - The {@link Sound} enum to stop.
     * @returns {Promise<void>} Resolves when stopped.
     */
    stop(sound: Sound): Promise<void>;

    /**
     * Stops all audio playback immediately.
     *
     * @returns {Promise<void>} Resolves when all sounds are stopped.
     */
    stopAll(): Promise<void>;

    /**
     * Toggles the master mute setting.
     * @returns {void} Returns nothing.
     */
    toggleMute(): void;

    /** Current master mute state. */
    muted: boolean;
}

/**
 * Interface for the time performance monitoring module.
 */
export interface TimePerformanceMonitor {
    /** Accessor for the enabled state of the monitor. */
    enabled: boolean;

    /**
     * Updates performance calculations.
     *
     * @param {number} deltaTime - Time elapsed since last frame.
     * @returns {void} Returns nothing.
     */
    update(deltaTime: number): void;

    /**
     * Records a logic tick occurrence for TPS calculation.
     * @returns {void} Returns nothing.
     */
    logTick(): void;

    /**
     * Renders the performance overlay stats.
     *
     * @param {p5} p - The P5 instance to draw on.
     * @param {number} tickInterval - The expected tick interval.
     * @returns {void} Returns nothing.
     */
    render(p: p5, tickInterval: number): void;
}

/**
 * Interface for the score and progression module.
 */
export interface Score {
    /** Current session score points. */
    score: number;

    /** Current high score. */
    highScore: number;

    /**
     * Adds points to the score, applying the current multiplier.
     *
     * @param {number} amount - Base points to add.
     * @returns {void} Returns nothing.
     */
    increaseScore(amount: number): void;

    /**
     * Resets the score to zero.
     * @returns {void} Returns nothing.
     */
    resetScore(): void;

    /**
     * Formats the current score as a padded string.
     *
     * @param {number} [digits] - Total characters (default: 6).
     * @returns {string} The formatted score (e.g., "000100").
     */
    getFormattedScore(digits?: number): string;

    /** Current point multiplier factor. */
    multiplier: number;

    /** Current game difficulty level. */
    level: number;

    /** Maximum allowed game level. */
    maxLevel: number;

    /**
     * Increases the difficulty level.
     *
     * @param {number} amount - Levels to advance.
     * @returns {void} Returns nothing.
     */
    increaseLevel(amount: number): void;

    /**
     * Resets the level to the starting value (1).
     * @returns {void} Returns nothing.
     */
    resetLevel(): void;

    /**
     * Sets up the game high score.
     *
     * @param {string} id - The game ID.
     * @returns {void} Returns nothing.
     */
    setupGameHighScore(id: string): void;
}

export interface Session extends StateSyncable, Debuggable {
    gameId: string;

    /**
     * Registers a serializable object to be saved in the session.
     *
     * @param {Serializable} serializable - The object to register.
     * @returns {void} Returns nothing.
     */
    register(serializable: Serializable): void;
    /**
     * Creates or updates the current session.
     * @returns {void} Returns nothing.
     */
    saveSession(): void;

    /**
     * Clears the current session.
     * @returns {void} Returns nothing.
     */
    clearSession(): void;

    /**
     * Sets whether the session is enabled.
     * @param {boolean} enabled - Whether the session should be enabled.
     * @returns {void} Returns nothing.
     */
    setSessionEnabled(enabled: boolean): void;

    /**
     * Checks if the session restoration modal is currently open.
     * @returns {boolean} True if the modal is open.
     */
    isModalOpen(): boolean;
    /** Returns true if the session restoration flow is complete. */
    isSessionResolved(): boolean;
    /**
     * Sets the function to be called when the session modal should be shown.
     * @param {function} showModal - The function to be called.
     * @returns {void} Returns nothing.
     */
    setShowModalFunction(showModal: (onConfirm: () => void, onCancel: () => void) => void): void;
    /**
     * Sets the function to be called when the session is canceled/cleared to reset the game.
     * @param {function} resetFn - The function to be called.
     * @returns {void} Returns nothing.
     */
    setResetFunction(resetFn: () => void): void;
}
