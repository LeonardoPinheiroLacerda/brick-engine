import p5 from 'p5';
import { Color, ControlKey, FontAlign, FontSize, FontVerticalAlign, Sound } from './enums';
import { Initializable, RendererInitializable } from './Interfaces';
import { Cell, ControlCallback, ControlEventType, Coordinate, RendererMetrics, GameModules, StateProperty } from './Types';

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
     */
    addRenderer(renderer: Renderer): void;

    /**
     * Orchestrates the rendering process by delegating to all registered renderers.
     *
     * @param {Cell[][]} grid - The current state of the game grid.
     * @param {GameModules} modules - Access to other engine modules.
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
     */
    setRendererMetrics(rendererMetrics: RendererMetrics): void;

    /**
     * Sets the text color to the "active" theme color.
     */
    setActiveText(): void;

    /**
     * Sets the text color to the "inactive" theme color.
     */
    setInactiveText(): void;

    /**
     * Sets the current font size.
     *
     * @param {FontSize} fontSize - The desired size enum value.
     */
    setTextSize(fontSize: FontSize): void;

    /**
     * Configures the text alignment settings.
     *
     * @param {FontAlign} fontAlign - The horizontal alignment.
     * @param {FontVerticalAlign} fontVerticalAlign - The vertical alignment.
     */
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void;

    /**
     * Renders text on the HUD area.
     *
     * @param {string} text - The string content to display.
     * @param {Coordinate} coordinate - The normalized position (0.0 to 1.0) within the HUD.
     */
    textOnHud(text: string, coordinate: Coordinate): void;

    /**
     * Renders text on the main display area.
     *
     * @param {string} text - The string content to display.
     * @param {Coordinate} coordinate - The normalized position (0.0 to 1.0) within the Display.
     */
    textOnDisplay(text: string, coordinate: Coordinate): void;
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
    width: number;

    /** The number of rows in the grid. */
    height: number;

    /**
     * Resets the entire grid to its empty state.
     */
    resetGrid(): void;

    /**
     * Iterates over every cell in the grid.
     *
     * @param {function(Cell): void} callback - The function to execute for each cell.
     */
    forEach(callback: (cell: Cell) => void): void;

    /**
     * Validates if a coordinate exists within the grid boundaries.
     *
     * @param {Coordinate} coordinate - The coordinate to check.
     * @returns {boolean} `true` if valid, `false` otherwise.
     */
    isValidCoordinate(coordinate: Coordinate): boolean;

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
     */
    setCellValue(coordinate: Coordinate, value: number): void;

    /**
     * Sets the color of a specific cell.
     *
     * @param {Coordinate} coordinate - The target location.
     * @param {Color} color - The new color.
     */
    setCellColor(coordinate: Coordinate, color: Color): void;

    /**
     * Checks if a cell is occupied (value > 0).
     *
     * @param {Coordinate} coordinate - The location to check.
     * @returns {boolean} `true` if active.
     */
    isCellActive(coordinate: Coordinate): boolean;

    /**
     * Checks if a cell is empty (value == 0).
     *
     * @param {Coordinate} coordinate - The location to check.
     * @returns {boolean} `true` if inactive.
     */
    isCellInactive(coordinate: Coordinate): boolean;

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
     */
    clearRow(y: number): void;

    /**
     * Shifts all rows above the specified index down by one.
     *
     * @param {number} fromY - The row index to start from.
     */
    shiftRowsDown(fromY: number): void;

    /**
     * Shifts all rows below the specified index up by one.
     *
     * @param {number} fromY - The row index to start from.
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
     */
    clearColumn(x: number): void;

    /**
     * Shifts all columns to the right of the specified index.
     *
     * @param {number} fromX - The column index to start from.
     */
    shiftColumnsRight(fromX: number): void;

    /**
     * Shifts all columns to the left of the specified index.
     *
     * @param {number} fromX - The column index to start from.
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
     */
    fillArea(start: Coordinate, end: Coordinate, value: number, color: Color): void;

    /**
     * Stamps a pattern of cells onto the grid.
     *
     * @param {Coordinate[]} coordinates - The list of cell locations to update.
     * @param {number} value - The value to apply.
     * @param {Color} color - The color to apply.
     */
    stampPiece(coordinates: Coordinate[], value: number, color: Color): void;
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
     */
    setMuted(value: boolean): void;

    /**
     * Retrieves the high score from persistence.
     *
     * @returns {number} The current high score.
     */
    getHighScore(): number;

    /**
     * Updates and persists the high score.
     *
     * @param {number} value - The new record.
     */
    setHighScore(value: number): void;

    /**
     * Subscribes to changes in a specific state property.
     *
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     */
    subscribe(property: StateProperty, callback: (value: boolean | number) => void): void;

    /**
     * Unsubscribes a callback from a specific state property.
     *
     * @param {StateProperty} property - The state property being monitored.
     * @param {function(boolean | number): void} callback - The callback reference to remove.
     */
    unsubscribe(property: StateProperty, callback: (value: boolean | number) => void): void;

    /** Turn the game system on. */
    turnOn(): void;

    /** Turn the game system off. */
    turnOff(): void;

    /** Initiate a new game (transition from Title Screen to Gameplay). */
    startGame(): void;

    /** Exit the current game session (transition to Title Screen). */
    exitGame(): void;

    /** Pause the current game logic. */
    pause(): void;

    /** Resume the game logic from a paused state. */
    resume(): void;

    /** Trigger a game over state. */
    triggerGameOver(): void;

    /** Reset the game state flags for a new round (post-Game Over). */
    resetGame(): void;

    /** Toggles the {@link StateProperty.COLOR_ENABLED} state. */
    toggleColorEnabled(): void;

    /** Toggles the {@link StateProperty.MUTED} state. */
    toggleMuted(): void;

    /**
     * Configures the key used for local storage persistence.
     *
     * @param {string} key - The unique prefix for storage keys.
     */
    setPersistenceKey(key: string): void;

    /**
     * Retrieves the current persistence key.
     *
     * @returns {string} The storage prefix.
     */
    getPersistenceKey(): string;
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
     */
    notify(key: ControlKey, type: ControlEventType): void;

    /**
     * Injects the module references required for populating the event context.
     *
     * @param {GameModules} modules - The collection of system modules.
     */
    setModules(modules: GameModules): void;

    /**
     * Registers a callback for a specific control event.
     *
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function to execute.
     */
    subscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Removes an existing subscription.
     *
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event trigger type.
     * @param {ControlCallback} callback - The function reference to remove.
     */
    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void;

    /**
     * Detaches all hardware/DOM event listeners.
     */
    unbindControls(): void;

    /**
     * Attaches all hardware/DOM event listeners.
     */
    bindControls(): void;
}

/**
 * Interface for the time module.
 * Manages the game loop timing, ticks, and delta time.
 */
export interface Time extends Initializable {
    /**
     * Accumulates passed time and calculates FPS/TPS.
     *
     * @param {number} deltaTime - Time elapsed since last frame in milliseconds.
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
     */
    reset(): void;

    /** The interval between logic ticks in milliseconds. */
    tickInterval: number;

    /**
     * Increases the tick interval (slowing down the game logic).
     *
     * @param {number} amount - Milliseconds to add.
     */
    incrementTickInterval(amount: number): void;

    /**
     * Decreases the tick interval (speeding up the game logic).
     *
     * @param {number} amount - Milliseconds to subtract.
     */
    decrementTickInterval(amount: number): void;
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
     */
    update(deltaTime: number): void;

    /**
     * Records a logic tick occurrence for TPS calculation.
     */
    logTick(): void;

    /**
     * Renders the performance overlay stats.
     *
     * @param {p5} p - The P5 instance to draw on.
     * @param {number} tickInterval - The expected tick interval.
     */
    render(p: p5, tickInterval: number): void;
}

/**
 * Interface for the score and progression module.
 */
export interface Score extends Initializable {
    /** Current session score points. */
    score: number;

    /**
     * Adds points to the score, applying the current multiplier.
     *
     * @param {number} amount - Base points to add.
     */
    increaseScore(amount: number): void;

    /**
     * Resets the score to zero.
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
     */
    increaseLevel(amount: number): void;

    /**
     * Resets the level to the starting value (1).
     */
    resetLevel(): void;

    /**
     * Dependencies injection map for Score context.
     *
     * @param {State} state - The game state module for high score persistence.
     */
    setState(state: State): void;
}
