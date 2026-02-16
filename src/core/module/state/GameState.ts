import configs from '../../../config/configs';
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
    [StateProperty.COLOR_ENABLED]   : { defaultValue: true  , storageKey: configs.storageKeys.colorEnabled },
    [StateProperty.MUTED]           : { defaultValue: false , storageKey: configs.storageKeys.muted },
    [StateProperty.HIGH_SCORE]      : { defaultValue: 0     , storageKey: configs.storageKeys.score },
};

/**
 * Manages the core boolean states of the game and handles state-change events.
 *
 * Provides a central hub for tracking game lifecycle states (on, running, gameOver)
 * and user preferences (color enabled).
 *
 * **Persistence Responsibility:**
 * This class is the SOLE responsible for persisting and loading player state
 * (like mute settings) from LocalStorage. Other modules should NOT access LocalStorage directly.
 */
export default class GameState implements State, Debuggable {
    private _persistenceKey: string = '';

    private _state: Map<StateProperty, boolean | number> = new Map();

    /** Map to store property names and their associated subscription callbacks. */

    private _subscribers: Map<StateProperty, Array<(value: boolean | number) => void>> = new Map();

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
     *
     * @private
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
     * @param {any} value - The value to set.
     * @private
     */

    private _set(property: StateProperty, value: boolean | number): void {
        const currentValue = this._state.get(property);
        if (currentValue !== value) {
            this._state.set(property, value);

            const config = STATE_CONFIG[property];
            if (config.storageKey) {
                localStorage.setItem(`${this._persistenceKey}.${config.storageKey}`, JSON.stringify(value));
            }

            this._notify(property, value);
        }
    }

    /**
     * Notifies all subscribers of a property change.
     *
     * @param {string} property - The property that changed.
     * @param {any} value - The new value of the property.
     * @private
     */

    private _notify(property: StateProperty, value: boolean | number): void {
        const callbacks = this._subscribers.get(property);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }

    isOn(): boolean {
        return this._state.get(StateProperty.ON) as boolean;
    }

    isOff(): boolean {
        return !this.isOn();
    }

    isStarted(): boolean {
        return this._state.get(StateProperty.START) as boolean;
    }

    isPlaying(): boolean {
        return this._state.get(StateProperty.PLAYING) as boolean;
    }

    isPaused(): boolean {
        return this.isStarted() && !this.isPlaying() && !this.isGameOver();
    }

    isGameOver(): boolean {
        return this._state.get(StateProperty.GAME_OVER) as boolean;
    }

    turnOn(): void {
        this._set(StateProperty.ON, true);
        this._set(StateProperty.START, false);
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, false);
    }

    turnOff(): void {
        this._set(StateProperty.ON, false);
        this._set(StateProperty.START, false);
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, false);
    }

    startGame(): void {
        if (!this.isOn()) return;
        this._set(StateProperty.START, true);
        this._set(StateProperty.PLAYING, true);
        this._set(StateProperty.GAME_OVER, false);
    }

    exitGame(): void {
        this._set(StateProperty.START, false);
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, false);
    }

    pause(): void {
        if (this.isStarted() && !this.isGameOver()) {
            this._set(StateProperty.PLAYING, false);
        }
    }

    resume(): void {
        if (this.isStarted() && !this.isGameOver()) {
            this._set(StateProperty.PLAYING, true);
        }
    }

    triggerGameOver(): void {
        this._set(StateProperty.PLAYING, false);
        this._set(StateProperty.GAME_OVER, true);
    }

    resetGame(): void {
        if (!this.isOn()) return;
        this._set(StateProperty.GAME_OVER, false);
        this._set(StateProperty.START, true);
        this._set(StateProperty.PLAYING, true);
    }

    isColorEnabled(): boolean {
        return this._state.get(StateProperty.COLOR_ENABLED) as boolean;
    }

    setColorEnabled(value: boolean): void {
        this._set(StateProperty.COLOR_ENABLED, value);
    }

    isMuted(): boolean {
        return this._state.get(StateProperty.MUTED) as boolean;
    }

    setMuted(value: boolean): void {
        this._set(StateProperty.MUTED, value);
    }

    getHighScore(): number {
        return this._state.get(StateProperty.HIGH_SCORE) as number;
    }

    setHighScore(value: number): void {
        this._set(StateProperty.HIGH_SCORE, value);
    }

    toggleColorEnabled(): void {
        this.setColorEnabled(!this.isColorEnabled());
    }

    toggleMuted(): void {
        this.setMuted(!this.isMuted());
    }

    /**
     * Subscribes to changes in specific state properties.
     *
     * @param {string} property - The state property to monitor.
     * @param {function(any): void} callback - The function to execute when the property changes.
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
     * @param {string} property - The state property to monitor (e.g., 'on', 'running').
     * @param {function(any): void} callback - The function to execute when the property changes.
     * @returns {void}
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
     * Sets the persistence key for the state.
     * This key is used to generate unique keys for each state property in LocalStorage.
     * @param {string} key - The persistence key.
     */
    setPersistenceKey(key: string): void {
        this._persistenceKey = key;
    }

    /**
     * Gets the persistence key for the state.
     * @returns {string} The persistence key.
     */
    getPersistenceKey(): string {
        return this._persistenceKey;
    }

    getDebugData(): Record<string, string | number | boolean> {
        return {
            on: this.isOn(),
            start: this.isStarted(),
            playing: this.isPlaying(),
            paused: this.isPaused(),
            game_over: this.isGameOver(),
            color_enabled: this.isColorEnabled(),
            muted: this.isMuted(),
            high_score: this.getHighScore(),
        };
    }
}
