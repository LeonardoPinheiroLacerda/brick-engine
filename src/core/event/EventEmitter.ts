// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback<T = any> = (payload?: T) => void;

/**
 * Narrow interface representing the engine state context required for contextual notifications.
 *
 * Designed to decouple the {@link EventEmitter} from the full `GameState` module.
 * It allows the emitter to query specific state properties without creating
 * circular dependencies, enabling dynamic routing of events into state-specific channels.
 */
export interface StateContext {
    isPlaying(): boolean;
    isOn(): boolean;
    isStarted(): boolean;
    isGameOver(): boolean;
    isPaused(): boolean;
}

/**
 * Valid event suffixes for contextual dispatch.
 *
 * Defines the strict set of string identifiers appended to base events to
 * create state-specific subscription channels. This guarantees type safety
 * when modules choose to listen only during specific game lifecycles.
 */
export enum EventSuffix {
    TITLE = 'title',
    PLAYING = 'playing',
    GAMEOVER = 'gameover',
    PAUSED = 'paused',
}

/**
 * Static event emitter for global pub/sub communication across the engine.
 *
 * Acts as the centralized communication backbone of the engine reactor,
 * allowing entirely decoupled modules to hook into each other's lifecycles.
 * By preventing tight coupling and direct method calls, it enables highly
 * scalable logic flow where input events or state changes can be broadcasted
 * to any interested subsystem dynamically.
 */
export default class EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _events: Record<string, EventCallback<any>[]> = {};

    /**
     * Subscribes a listener callback to an event channel.
     *
     * Registers a callback function to be executed whenever the specified event
     * is emitted. If a {@link EventSuffix} is provided, it subscribes to the
     * contextual sub-channel (e.g. `UP:playing`) instead of the base channel.
     *
     * @param {string} eventName - The base string identifier of the event to listen for.
     * @param {EventCallback<T>} callback - The function to execute when the event triggers. Receives the payload if applicable.
     * @param {EventSuffix} [suffix] - The optional modifier to listen only on state-restricted channels.
     * @returns {void} Returns nothing.
     */
    static subscribe<T>(eventName: string, callback: EventCallback<T>, suffix?: EventSuffix): void {
        const finalName = this._formatName(eventName, suffix);
        if (!this._events[finalName]) {
            this._events[finalName] = [];
        }
        this._events[finalName].push(callback);
    }

    /**
     * Unsubscribes an existing listener from an event channel.
     *
     * Safely removes the provided callback from the notification queue.
     * If the event was subscribed with a suffix, the same {@link EventSuffix}
     * must be provided here to target the correct sub-channel.
     *
     * @param {string} eventName - The base string identifier of the event.
     * @param {EventCallback<T>} callback - The exact function reference previously passed to `subscribe`.
     * @param {EventSuffix} [suffix] - The optional context restricted modifier previously utilized.
     * @returns {void} Returns nothing.
     */
    static unsubscribe<T>(eventName: string, callback: EventCallback<T>, suffix?: EventSuffix): void {
        const finalName = this._formatName(eventName, suffix);
        if (!this._events[finalName]) return;
        this._events[finalName] = this._events[finalName].filter(cb => cb !== callback);
    }

    /**
     * Emits a standard event, triggering all registered standard callbacks.
     *
     * Iterates over all callbacks associated with the given channel key and
     * invokes them sequentially with the provided payload. This acts strictly
     * on the base channel without evaluating current game states.
     *
     * @param {string} eventName - The precise name of the channel to broadcast on.
     * @param {T} [payload] - The optional contextual data payload passed structurally to each callback.
     * @returns {void} Returns nothing.
     */
    static notify<T>(eventName: string, payload?: T): void {
        if (!this._events[eventName]) return;
        this._events[eventName].forEach(callback => callback(payload));
    }

    /**
     * Dispatches an event to the base channel and evaluates contextual channels.
     *
     * Performs a standard notify on the base `eventName`, and then evaluates
     * the provided {@link StateContext} to decide which secondary {@link EventSuffix}
     * channel should also receive the payload. This enables multi-cast
     * signals where listeners can opt into receiving only under certain states.
     *
     * @param {string} eventName - The core string identifier of the event broadcast.
     * @param {T} payload - The required event data to be passed to callbacks in both base and context channels.
     * @param {StateContext} context - The engine state provider used to determine applicable conditions (Playing, Paused, Title, Gameover).
     * @returns {void} Returns nothing.
     */
    static notifyContextual<T>(eventName: string, payload: T, context: StateContext): void {
        // Emit to base channel
        this.notify(eventName, payload);

        // Context-specific channel dispatch
        if (context.isPlaying()) {
            this.notify(this._formatName(eventName, EventSuffix.PLAYING), payload);
        } else if (context.isPaused()) {
            this.notify(this._formatName(eventName, EventSuffix.PAUSED), payload);
        } else if (context.isOn() && !context.isStarted()) {
            this.notify(this._formatName(eventName, EventSuffix.TITLE), payload);
        } else if (context.isGameOver()) {
            this.notify(this._formatName(eventName, EventSuffix.GAMEOVER), payload);
        }
    }

    /**
     * Formats an event name with an optional localized suffix string.
     *
     * Used internally to guarantee uniform string keys when registering or
     * triggering targeted contextual communication channels.
     *
     * @param {string} base - The fundamental event identifier string.
     * @param {EventSuffix} [suffix] - The specific contextual modifier enum to append.
     * @returns {string} The fully combined and formatted channel key suitable for indexing the internal registry.
     */
    private static _formatName(base: string, suffix?: EventSuffix): string {
        return suffix ? `${base}:${suffix}` : base;
    }

    /**
     * Clears all universally registered events and listener channels.
     *
     * Highly destructive, this function wipes the entire internal communications
     * map. Primarily purposed for unit testing workflows to ensure zero listener
     * contamination across differing test cases.
     *
     * @returns {void} Returns nothing.
     */
    static clear(): void {
        this._events = {};
    }
}
