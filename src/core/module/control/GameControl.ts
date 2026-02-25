import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import { Debuggable } from '../../types/Interfaces';
import { ControlCallback, ControlEventType, GameEvent, GameModules } from '../../types/Types';
import GameControlKeyBinding from './GameControlKeyBinding';
import EventEmitter from '../../event/EventEmitter';

/**
 * Manages game control inputs and event dispatching.
 * Acts as the central hub for handling user input and notifying subscribers.
 */
export default class GameControl implements Control, Debuggable {
    private _modules: GameModules;

    private _keyBinding: GameControlKeyBinding;
    private _activeListeners: Array<{ event: string; callback: ControlCallback }> = [];

    /**
     * Initializes the control system.
     * Sets up key bindings and prepares the input handler.
     */
    setup() {
        this._keyBinding = new GameControlKeyBinding(this);

        this._keyBinding.bindControls();
    }

    /**
     * Unbinds all control event listeners.
     */
    unbindControls() {
        this._keyBinding.unbindControls();
        this._activeListeners.forEach(({ event, callback }) => {
            EventEmitter.unsubscribe(event, callback);
        });
        this._activeListeners = [];
    }

    /**
     * Binds all control event listeners.
     */
    bindControls() {
        this._keyBinding.bindControls();
    }

    /**
     * Injects the game modules for context-aware events.
     *
     * @param {GameModules} modules - The collected game modules.
     */
    setModules(modules: GameModules): void {
        this._modules = modules;
    }

    /**
     * Subscribes a callback to a specific control event.
     *
     * @param {ControlKey} key - The key to listen for.
     * @param {ControlEventType} type - The event type (pressed/held).
     * @param {ControlCallback} callback - The function to execute.
     */
    subscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}`;
        EventEmitter.subscribe(eventStr, callback);
        this._activeListeners.push({ event: eventStr, callback });
    }

    /**
     * Unsubscribes a callback from a control event.
     *
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event type.
     * @param {ControlCallback} callback - The function to remove.
     */
    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}`;
        EventEmitter.unsubscribe(eventStr, callback);
        this._activeListeners = this._activeListeners.filter(l => !(l.event === eventStr && l.callback === callback));
    }

    /**
     * Subscribes a callback to a control event ONLY during the title screen.
     */
    subscribeForTitleScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}:title`;
        EventEmitter.subscribe(eventStr, callback);
        this._activeListeners.push({ event: eventStr, callback });
    }

    /**
     * Unsubscribes a callback from a title screen control event.
     */
    unsubscribeForTitleScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}:title`;
        EventEmitter.unsubscribe(eventStr, callback);
        this._activeListeners = this._activeListeners.filter(l => !(l.event === eventStr && l.callback === callback));
    }

    /**
     * Subscribes a callback to a control event ONLY during the game over screen.
     */
    subscribeForGameOverScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}:gameover`;
        EventEmitter.subscribe(eventStr, callback);
        this._activeListeners.push({ event: eventStr, callback });
    }

    /**
     * Unsubscribes a callback from a game over screen control event.
     */
    unsubscribeForGameOverScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}:gameover`;
        EventEmitter.unsubscribe(eventStr, callback);
        this._activeListeners = this._activeListeners.filter(l => !(l.event === eventStr && l.callback === callback));
    }

    /**
     * Subscribes a callback to a control event ONLY during active gameplay.
     */
    subscribeForPlayingScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}:playing`;
        EventEmitter.subscribe(eventStr, callback);
        this._activeListeners.push({ event: eventStr, callback });
    }

    /**
     * Unsubscribes a callback from a playing screen control event.
     */
    unsubscribeForPlayingScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const eventStr = `${key}:${type}:playing`;
        EventEmitter.unsubscribe(eventStr, callback);
        this._activeListeners = this._activeListeners.filter(l => !(l.event === eventStr && l.callback === callback));
    }

    /**
     * Notifies subscribers of a control event.
     *
     * @param {ControlKey} key - The key triggering the event.
     * @param {ControlEventType} type - The type of event.
     * @throws {Error} If modules have not been initialized.
     */
    notify(key: ControlKey, type: ControlEventType): void {
        if (!this._modules) {
            throw new Error('Modules not initialized');
        }

        const event: GameEvent = {
            key,
            type,
            modules: this._modules,
        };

        const state = this._modules.state;

        let isAllowed = false;

        if (state.isOff()) {
            isAllowed = key === ControlKey.POWER;
        } else if (!state.isStarted() || state.isPlaying() || state.isGameOver()) {
            isAllowed = true;
        } else if (state.isPaused()) {
            isAllowed = key.endsWith(';system');
        }

        if (isAllowed) {
            // Emit to base channel
            EventEmitter.notify(`${key}:${type}`, event);

            // Context-specific channel dispatch
            if (state.isPlaying()) {
                EventEmitter.notify(`${key}:${type}:playing`, event);
            } else if (state.isOn() && !state.isStarted()) {
                EventEmitter.notify(`${key}:${type}:title`, event);
            } else if (state.isGameOver()) {
                EventEmitter.notify(`${key}:${type}:gameover`, event);
            }
        }
    }

    /**
     * Retrieves debug information about the control system.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            total_active_listeners: this._activeListeners.length,
        };
    }
}
