import configs from '../../../config/configs';
import { State } from '../../types/modules';
import { StateProperty } from '../../types/Types';

/**
 * Manages the core boolean states of the game and handles state-change events.
 *
 * Provides a central hub for tracking game lifecycle states (on, running, gameOver)
 * and user preferences (color enabled), with persistence support.
 */
export default class GameState implements State {
    private _on: boolean = false;
    private _start: boolean = false;
    private _running: boolean = false;
    private _gameOver: boolean = false;
    private _colorEnabled: boolean = true;
    private _muted: boolean = false;

    /** Map to store property names and their associated subscription callbacks. */
    private _subscribers: Map<string, Array<(value: boolean) => void>> = new Map();

    setup(): void {
        this._loadPersistentState();
    }

    /**
     * Loads persistent state from LocalStorage.
     *
     * @private
     */
    private _loadPersistentState(): void {
        const { colorEnabled, muted } = configs.storageKeys;

        const storedColor = localStorage.getItem(colorEnabled);
        if (storedColor !== null) {
            this._colorEnabled = JSON.parse(storedColor);
        }

        const storedMuted = localStorage.getItem(muted);
        if (storedMuted !== null) {
            this._muted = JSON.parse(storedMuted);
        }
    }

    /**
     * Notifies all subscribers of a property change.
     *
     * @param {string} property - The property that changed.
     * @param {boolean} value - The new value of the property.
     * @private
     */
    private _notify(property: StateProperty, value: boolean): void {
        const callbacks = this._subscribers.get(property);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }

    public get on(): boolean {
        return this._on;
    }

    public set on(value: boolean) {
        if (this._on !== value) {
            this._on = value;
            this._notify('on', value);
        }
    }

    public get start(): boolean {
        return this._start;
    }

    public set start(value: boolean) {
        if (this._start !== value) {
            this._start = value;
            this._notify('start', value);
        }
    }

    public get running(): boolean {
        return this._running;
    }

    public set running(value: boolean) {
        if (this._running !== value) {
            this._running = value;
            this._notify('running', value);
        }
    }

    public get gameOver(): boolean {
        return this._gameOver;
    }

    public set gameOver(value: boolean) {
        if (this._gameOver !== value) {
            this._gameOver = value;
            this._notify('gameOver', value);
        }
    }

    public get colorEnabled(): boolean {
        return this._colorEnabled;
    }

    public set colorEnabled(value: boolean) {
        const { colorEnabled } = configs.storageKeys;

        if (this._colorEnabled !== value) {
            this._colorEnabled = value;
            localStorage.setItem(colorEnabled, JSON.stringify(value));
            this._notify('colorEnabled', value);
        }
    }

    public get muted(): boolean {
        return this._muted;
    }

    public set muted(value: boolean) {
        const { muted } = configs.storageKeys;

        if (this._muted !== value) {
            this._muted = value;
            localStorage.setItem(muted, JSON.stringify(value));
            this._notify('muted', value);
        }
    }

    public toggleOn(): void {
        this.on = !this.on;
    }

    public toggleStart(): void {
        this.start = !this.start;
    }

    public toggleRunning(): void {
        this.running = !this.running;
    }

    public toggleGameOver(): void {
        this.gameOver = !this.gameOver;
    }

    public toggleColorEnabled(): void {
        this.colorEnabled = !this.colorEnabled;
    }

    public toggleMuted(): void {
        this.muted = !this.muted;
    }

    /**
     * Subscribes to changes in specific state properties.
     *
     * @param {string} property - The state property to monitor.
     * @param {function(boolean): void} callback - The function to execute when the property changes.
     */
    public subscribe(property: StateProperty, callback: (value: boolean) => void): void {
        if (!this._subscribers.has(property)) {
            this._subscribers.set(property, []);
        }
        this._subscribers.get(property)?.push(callback);
    }
}
