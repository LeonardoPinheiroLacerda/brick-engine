import { Debuggable } from '../../types/Interfaces';
import { State } from '../../types/modules';
import { StateProperty } from '../../types/Types';

type StateMetadata = {
    defaultValue: boolean | number;
    storageKey?: string;
};

// prettier-ignore
const STATE_CONFIG: Record<StateProperty, StateMetadata> = {
    [StateProperty.ON]              : { defaultValue: false },
    [StateProperty.START]           : { defaultValue: false },
    [StateProperty.PLAYING]         : { defaultValue: false },
    [StateProperty.GAME_OVER]       : { defaultValue: false },
    [StateProperty.COLOR_ENABLED]   : { defaultValue: true   , storageKey: 'colorEnabled' },
    [StateProperty.MUTED]           : { defaultValue: false  , storageKey: 'muted'        },
};

/**
 * Manages the core boolean states of the game and handles state-change events.
 *
 * Provides a central hub for tracking game lifecycle states (on, running, gameOver)
 * and user preferences (color enabled).
 *
 *
 * **Persistence Responsibility:**
 * This class is the SOLE responsible for persisting and loading generic, cross-session
 * player preferences (like mute settings and color toggle) from LocalStorage.
 * It does NOT handle transient session data (GameSession) or specific scoring logic (GameScore).
 */
export default class GameState implements State, Debuggable {
    private _state: Map<StateProperty, boolean | number> = new Map();

    /** Map to store property names and their associated subscription callbacks. */

    private _subscribers: Map<StateProperty, Array<(value: boolean | number) => void>> = new Map();

    /**
     * Initializes the state module.
     * Sets default values for all state properties and loads persisted data.
     */
    setup(): void {
        // Initialize default values
        Object.values(StateProperty).forEach(property => {
            const config = STATE_CONFIG[property];
            this._state.set(property, config.defaultValue);
        });

        this._loadPersistentState();
    }

    /**
     * Loads persistent state from LocalStorage.
     */
    private _loadPersistentState(): void {
        Object.values(StateProperty).forEach(property => {
            const config = STATE_CONFIG[property];
            if (config.storageKey) {
                const storedValue = localStorage.getItem(config.storageKey);
                if (storedValue !== null) {
                    this._state.set(property, JSON.parse(storedValue));
                }
            }
        });
    }

    /**
     * Sets a state property value, handling persistence and notification.
     *
     * @param {StateProperty} property - The property to set.
     * @param {boolean | number} value - The value to set.
     */
    private _set(property: StateProperty, value: boolean | number): void {
        const currentValue = this._state.get(property);
        if (currentValue !== value) {
            this._state.set(property, value);

            const config = STATE_CONFIG[property];
            if (config.storageKey) {
                localStorage.setItem(config.storageKey, JSON.stringify(value));
            }

            this._notify(property, value);
        }
    }

    /**
     * Notifies all subscribers of a property change.
     *
     * @param {StateProperty} property - The property that changed.
     * @param {boolean | number} value - The new value of the property.
     */
    private _notify(property: StateProperty, value: boolean | number): void {
        const callbacks = this._subscribers.get(property);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }

    /**
     * Checks if the game machine is powered on.
     *
     * @returns {boolean} True if powered on.
     */
    isOn(): boolean {
        return this._state.get(StateProperty.ON) as boolean;
    }

    /**
     * Checks if the game machine is powered off.
     *
     * @returns {boolean} True if powered off.
     */
    isOff(): boolean {
        return !this.isOn();
    }

    /**
     * Checks if a game session has currently started.
     * This includes both playing and paused states.
     *
     * @returns {boolean} True if a game is active.
     */
    isStarted(): boolean {
        return this._state.get(StateProperty.START) as boolean;
    }

    /**
     * Checks if the game is currently running (not paused, not game over).
     *
     * @returns {boolean} True if gameplay is active.
     */
    isPlaying(): boolean {
        return this._state.get(StateProperty.PLAYING) as boolean;
    }

    /**
     * Checks if the game is paused.
     *
     * @returns {boolean} True if the game is started but not playing (and not game over).
     */
    isPaused(): boolean {
        return this.isStarted() && !this.isPlaying() && !this.isGameOver();
    }

    /**
     * Checks if the game is in a "Game Over" state.
     *
     * @returns {boolean} True if the game is over.
     */
    isGameOver(): boolean {
        return this._state.get(StateProperty.GAME_OVER) as boolean;
    }

    /**
     * Powers on the game machine.
     * Resets all session states (start, playing, game over).
     */
    turnOn(): void {
        this._set(StateProperty.ON, true);
        this._set(StateProperty.START, false);
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, false);
    }

    /**
     * Powers off the game machine.
     * Resets all states.
     */
    turnOff(): void {
        this._set(StateProperty.ON, false);
        this._set(StateProperty.START, false);
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, false);
    }

    /**
     * Starts a new game session.
     * Only works if the machine is powered on.
     */
    startGame(): void {
        if (!this.isOn()) return;
        this._set(StateProperty.START, true);
        this._set(StateProperty.PLAYING, true);
        this._set(StateProperty.GAME_OVER, false);
    }

    /**
     * Resets the game over state and starts the game again.
     */
    resetGameOver(): void {
        this._set(StateProperty.GAME_OVER, false);
        this._set(StateProperty.START, true);
        this._set(StateProperty.PLAYING, true);
    }

    /**
     * Exits the current game session, returning to the "On" state.
     */
    exitGame(): void {
        this._set(StateProperty.START, false);
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, false);
    }

    /**
     * Pauses the current game.
     */
    pause(): void {
        if (this.isStarted() && !this.isGameOver()) {
            this._set(StateProperty.PLAYING, false);
        }
    }

    /**
     * Resumes the game from a paused state.
     */
    resume(): void {
        if (this.isStarted() && !this.isGameOver()) {
            this._set(StateProperty.PLAYING, true);
        }
    }

    /**
     * Triggers the "Game Over" state.
     * Stops gameplay.
     */
    triggerGameOver(): void {
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, true);
    }

    /**
     * Resets the game to the initial state (restarts).
     */
    resetGame(): void {
        if (!this.isOn()) return;
        this._set(StateProperty.GAME_OVER, false);
        this._set(StateProperty.START, true);
        this._set(StateProperty.PLAYING, true);
    }

    /**
     * Checks if color mode is enabled.
     *
     * @returns {boolean} True if color is enabled.
     */
    isColorEnabled(): boolean {
        return this._state.get(StateProperty.COLOR_ENABLED) as boolean;
    }

    /**
     * Enables or disables color mode.
     *
     * @param {boolean} value - True to enable, false to disable.
     */
    setColorEnabled(value: boolean): void {
        this._set(StateProperty.COLOR_ENABLED, value);
    }

    /**
     * Checks if audio is muted.
     *
     * @returns {boolean} True if muted.
     */
    isMuted(): boolean {
        return this._state.get(StateProperty.MUTED) as boolean;
    }

    /**
     * Mutes or unmutes the audio.
     *
     * @param {boolean} value - True to mute, false to unmute.
     */
    setMuted(value: boolean): void {
        this._set(StateProperty.MUTED, value);
    }

    /**
     * Toggles the color enabled state.
     */
    toggleColorEnabled(): void {
        this.setColorEnabled(!this.isColorEnabled());
    }

    /**
     * Toggles the muted state.
     */
    toggleMuted(): void {
        this.setMuted(!this.isMuted());
    }

    /**
     * Subscribes to changes in specific state properties.
     *
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to execute when the property changes.
     */
    subscribe(property: StateProperty, callback: (value: boolean | number) => void): void {
        if (!this._subscribers.has(property)) {
            this._subscribers.set(property, []);
        }
        this._subscribers.get(property)?.push(callback);
    }

    /**
     * Unsubscribes from changes in specific state properties.
     *
     * @param {StateProperty} property - The state property to monitor.
     * @param {function(boolean | number): void} callback - The function to remove.
     */
    unsubscribe(property: StateProperty, callback: (value: boolean | number) => void): void {
        const callbacks = this._subscribers.get(property);
        if (callbacks) {
            this._subscribers.set(
                property,
                callbacks.filter(cb => cb !== callback),
            );
        }
    }

    /**
     * Retrieves debug information about the game state.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            on: this.isOn(),
            start: this.isStarted(),
            playing: this.isPlaying(),
            paused: this.isPaused(),
            game_over: this.isGameOver(),
            color_enabled: this.isColorEnabled(),
            muted: this.isMuted(),
        };
    }
}
