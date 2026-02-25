// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback<T = any> = (payload?: T) => void;

/**
 * Narrow interface representing the engine state context required for contextual notifications.
 */
export interface StateContext {
    isPlaying(): boolean;
    isOn(): boolean;
    isStarted(): boolean;
    isGameOver(): boolean;
}

/**
 * Valid event suffixes for contextual dispatch.
 */
export enum EventSuffix {
    TITLE = 'title',
    PLAYING = 'playing',
    GAMEOVER = 'gameover',
}

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
     * Dispatches an event to the base channel and automatically to contextual channels
     * (:playing, :title, :gameover) based on the provided state context.
     *
     * @param eventName The base name of the event.
     * @param payload Optional data to pass to the callbacks.
     * @param context The engine state context.
     */
    static notifyContextual<T>(eventName: string, payload: T, context: StateContext): void {
        // Emit to base channel
        this.notify(eventName, payload);

        // Context-specific channel dispatch
        if (context.isPlaying()) {
            this.notify(this.formatName(eventName, EventSuffix.PLAYING), payload);
        } else if (context.isOn() && !context.isStarted()) {
            this.notify(this.formatName(eventName, EventSuffix.TITLE), payload);
        } else if (context.isGameOver()) {
            this.notify(this.formatName(eventName, EventSuffix.GAMEOVER), payload);
        }
    }

    /**
     * Formats an event name with an optional suffix.
     *
     * @param base The base event name.
     * @param suffix The optional context suffix.
     * @returns The formatted event string.
     */
    static formatName(base: string, suffix?: EventSuffix): string {
        return suffix ? `${base}:${suffix}` : base;
    }

    /**
     * Clears all registered events and listeners. Useful for cleanup or testing.
     */
    static clear(): void {
        this._events = {};
    }
}
