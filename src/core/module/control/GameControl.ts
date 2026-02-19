import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import { Debuggable } from '../../types/Interfaces';
import { ControlCallback, ControlEventType, GameEvent, GameModules } from '../../types/Types';
import GameControlKeyBinding from './GameControlKeyBinding';

/**
 * Manages game control inputs and event dispatching.
 * Acts as the central hub for handling user input and notifying subscribers.
 */
export default class GameControl implements Control, Debuggable {
    private _modules: GameModules;

    private _keyBinding: GameControlKeyBinding;
    private _subscribers: Map<ControlKey, Map<ControlEventType, Set<ControlCallback>>> = new Map();

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
        this._subscribers.clear();
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
        if (!this._subscribers.has(key)) {
            this._subscribers.set(key, new Map());
        }

        const keySubscribers = this._subscribers.get(key)!;
        if (!keySubscribers.has(type)) {
            keySubscribers.set(type, new Set());
        }

        keySubscribers.get(type)!.add(callback);
    }

    /**
     * Unsubscribes a callback from a control event.
     *
     * @param {ControlKey} key - The key to stop listening for.
     * @param {ControlEventType} type - The event type.
     * @param {ControlCallback} callback - The function to remove.
     */
    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const keySubscribers = this._subscribers.get(key);
        if (keySubscribers) {
            const callbacks = keySubscribers.get(type);
            if (callbacks) {
                callbacks.delete(callback);
            }
        }
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

        const callbacks = this._subscribers.get(key)?.get(type);
        if (callbacks) {
            callbacks.forEach(callback => callback(event));
        }
    }

    /**
     * Retrieves debug information about the control system.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
     */
    getDebugData(): Record<string, string | number | boolean> {
        let totalSubscribers = 0;
        this._subscribers.forEach(keyMap => {
            keyMap.forEach(typeSet => {
                totalSubscribers += typeSet.size;
            });
        });

        return {
            total_subscribers: totalSubscribers,
            tracked_keys: this._subscribers.size,
        };
    }
}
