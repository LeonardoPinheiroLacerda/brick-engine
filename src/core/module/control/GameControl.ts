import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import { ControlCallback, ControlEventType, GameEvent, GameModules } from '../../types/Types';

export default class GameControl implements Control {
    private _modules: GameModules;
    private _subscribers: Map<ControlKey, Map<ControlEventType, Set<ControlCallback>>> = new Map();

    setup() {
        this._subscribeSystemControls();
    }

    private _subscribeSystemControls(): void {
        this.subscribe(ControlKey.POWER, 'pressed', event => event.modules.state.toggleOn());
        this.subscribe(ControlKey.SOUND, 'pressed', event => event.modules.state.toggleMuted());
        this.subscribe(ControlKey.COLOR, 'pressed', event => event.modules.state.toggleColorEnabled());
        this.subscribe(ControlKey.RESET, 'pressed', event => {
            event.modules.grid.resetGrid();
            if (event.modules.state.gameOver) {
                event.modules.state.toggleGameOver();
            }
        });
        this.subscribe(ControlKey.START_PAUSE, 'pressed', event => {
            if (!event.modules.state.start) {
                event.modules.state.toggleStart();
            }
            event.modules.state.toggleRunning();
        });
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
}
