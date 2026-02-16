import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import { Debuggable } from '../../types/Interfaces';
import { ControlCallback, ControlEventType, GameEvent, GameModules } from '../../types/Types';
import GameControlKeyBinding from './GameControlKeyBinding';

export default class GameControl implements Control, Debuggable {
    private _modules: GameModules;

    private _keyBinding: GameControlKeyBinding;
    private _subscribers: Map<ControlKey, Map<ControlEventType, Set<ControlCallback>>> = new Map();

    setup() {
        this._keyBinding = new GameControlKeyBinding(this);

        this._keyBinding.bindControls();
    }

    unbindControls() {
        this._keyBinding.unbindControls();
        this._subscribers.clear();
    }

    bindControls() {
        this._keyBinding.bindControls();
    }

    setModules(modules: GameModules): void {
        this._modules = modules;
    }

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

    unsubscribe(key: ControlKey, type: ControlEventType, callback: ControlCallback): void {
        const keySubscribers = this._subscribers.get(key);
        if (keySubscribers) {
            const callbacks = keySubscribers.get(type);
            if (callbacks) {
                callbacks.delete(callback);
            }
        }
    }

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
