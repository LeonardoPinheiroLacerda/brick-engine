import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import { Debuggable } from '../../types/Interfaces';
import { ControlCallback, ControlEventType, GameEvent, GameModules } from '../../types/Types';
import GameControlKeyBinding from './GameControlKeyBinding';
import EventEmitter, { EventSuffix } from '../../event/EventEmitter';

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

    subscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._subscribe(key, type, callback);
    }

    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._unsubscribe(key, type, callback);
    }

    subscribeForTitleScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._subscribe(key, type, callback, EventSuffix.TITLE);
    }

    unsubscribeForTitleScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._unsubscribe(key, type, callback, EventSuffix.TITLE);
    }

    subscribeForGameOverScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._subscribe(key, type, callback, EventSuffix.GAMEOVER);
    }

    unsubscribeForGameOverScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._unsubscribe(key, type, callback, EventSuffix.GAMEOVER);
    }

    subscribeForPlayingScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._subscribe(key, type, callback, EventSuffix.PLAYING);
    }

    unsubscribeForPlayingScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._unsubscribe(key, type, callback, EventSuffix.PLAYING);
    }

    subscribeForPausedScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._subscribe(key, type, callback, EventSuffix.PAUSED);
    }

    unsubscribeForPausedScreen(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        this._unsubscribe(key, type, callback, EventSuffix.PAUSED);
    }

    private _subscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback, suffix?: EventSuffix): void {
        const baseName = `${key}:${type}`;
        EventEmitter.subscribe(baseName, callback, suffix);
        const finalName = suffix ? `${baseName}:${suffix}` : baseName;
        this._activeListeners.push({ event: finalName, callback });
    }

    private _unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback, suffix?: EventSuffix): void {
        const baseName = `${key}:${type}`;
        EventEmitter.unsubscribe(baseName, callback, suffix);
        const finalName = suffix ? `${baseName}:${suffix}` : baseName;
        this._activeListeners = this._activeListeners.filter(l => !(l.event === finalName && l.callback === callback));
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
            EventEmitter.notifyContextual(`${key}:${type}`, event, state);
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
