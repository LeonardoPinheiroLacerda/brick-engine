import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import { Debuggable } from '../../types/Interfaces';
import { ControlCallback, ControlEventType, GameEvent, GameModules } from '../../types/Types';
import GameControlKeyBinding from './GameControlKeyBinding';
import EventEmitter, { EventSuffix } from '../../event/EventEmitter';

/**
 * Central event bus module processing physical hardware inputs into abstract engine events.
 *
 * It establishes a dedicated hub that isolates browser/device specific listeners out from
 * the game domains. It maps normalized key presses directly to {@link ControlKey} abstractions
 * and actively restricts event propagation downstream depending on the core {@link GameState}
 * (e.g. blocking inputs during session modals or paused states).
 */
export default class GameControl implements Control, Debuggable {
    private _modules: GameModules;

    private _keyBinding: GameControlKeyBinding;
    private _activeListeners: Array<{ event: string; callback: ControlCallback }> = [];

    /**
     * Initializes the central control system and mounts physical browser DOM listeners.
     *
     * @returns {void} Returns nothing.
     */
    setup() {
        this._keyBinding = new GameControlKeyBinding(this);

        this._keyBinding.bindControls();
    }

    /**
     * Unbinds all control event listeners and detaches physical DOM bindings.
     *
     * @returns {void} Returns nothing.
     */
    unbindControls() {
        this._keyBinding.unbindControls();
        this._activeListeners.forEach(({ event, callback }) => {
            EventEmitter.unsubscribe(event, callback);
        });
        this._activeListeners = [];
    }

    /**
     * Re-binds physical control event listeners if detached.
     *
     * @returns {void} Returns nothing.
     */
    bindControls() {
        this._keyBinding.bindControls();
    }

    /**
     * Injects the active context game modules needed for state-aware event blocking logic.
     *
     * @param {GameModules} modules - The active registered cluster of generic game modules.
     * @returns {void} Returns nothing.
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
     * Natively triggers an abstract game event securely down the core pipeline.
     * Processes strict architectural logic gates (e.g., blocking during modals) before broadcasting.
     *
     * @param {ControlKey} key - The abstract virtual key intent dispatching the signal.
     * @param {ControlEventType} type - The behavior suffix (e.g. PRESSED vs HELD).
     * @returns {void} Returns nothing.
     * @throws {Error} Immediately if the foundational context modules have not yet been initialized.
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
        const session = this._modules.session;

        let isAllowed = false;
        if (session.isModalOpen()) {
            isAllowed = false;
        } else if (state.isPlaying() && !session.isSessionResolved()) {
            isAllowed = false;
        } else if (state.isOff()) {
            isAllowed = key === ControlKey.POWER || key === ControlKey.TRACKPAD;
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
     * Calculates debug metadata mapping arrays for the live diagnostics monitor.
     *
     * @returns {Record<string, string | number | boolean>} A shallow payload of the list length sizes.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            total_active_listeners: this._activeListeners.length,
        };
    }
}
