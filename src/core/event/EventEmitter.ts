// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback<T = any> = (payload?: T) => void;

/**
 * Static event emitter for global pub/sub communication across the engine.
 */
export default class EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _events: Record<string, EventCallback<any>[]> = {};

    /**
     * Subscribes to an event.
     *
     * @param eventName The name of the event to listen for.
     * @param callback The function to execute when the event is emitted.
     */
    static subscribe<T>(eventName: string, callback: EventCallback<T>): void {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    }

    /**
     * Unsubscribes from an event.
     *
     * @param eventName The name of the event.
     * @param callback The specific callback function to remove.
     */
    static unsubscribe<T>(eventName: string, callback: EventCallback<T>): void {
        if (!this._events[eventName]) return;
        this._events[eventName] = this._events[eventName].filter(cb => cb !== callback);
    }

    /**
     * Emits an event, triggering all registered callbacks with the provided payload.
     *
     * @param eventName The name of the event to emit.
     * @param payload Optional data to pass to the callbacks.
     */
    static notify<T>(eventName: string, payload?: T): void {
        if (!this._events[eventName]) return;
        this._events[eventName].forEach(callback => callback(payload));
    }

    /**
     * Clears all registered events and listeners. Useful for cleanup or testing.
     */
    static clear(): void {
        this._events = {};
    }
}
