/**
 * Architectural utility strictly handling transparent auto-save points for custom class boundaries.
 *
 * Acts as an agnostic cloning proxy safely evaluating and storing external state payloads without
 * developers writing boilerplate serialization functions inside native subclasses each time.
 */
export default class InitialStateSnapshot {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _initialState: Map<string, any> = new Map();
    private _baseProperties: string[] = [];

    /**
     * Caches native structure references dictating immutable engine properties to ignore visually.
     *
     * @param {object} instance - The internal unpopulated layout.
     * @returns {void} Returns nothing.
     */
    captureBaseProperties(instance: object): void {
        this._baseProperties = Object.keys(instance);
    }

    /**
     * Caches a fully deep-cloned structural reference encapsulating foreign client properties exactly.
     *
     * @param {object} instance - The populated concrete object class.
     * @returns {void} Returns nothing.
     */
    captureInitialState(instance: object): void {
        console.log('capturing initial state for snapshot');
        Object.entries(instance).forEach(([key, value]) => {
            if (!this._baseProperties.includes(key) && typeof value !== 'function') {
                let initialValue = value;
                try {
                    // Try to use a custom clone method first
                    if (value && typeof value === 'object') {
                        // Only use structuredClone for plain objects or arrays
                        const isPlainObject = Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
                        const isArray = Array.isArray(value);

                        if (isPlainObject || isArray) {
                            initialValue = structuredClone(value);
                        } else {
                            // It's a class instance without a clone/copy method.
                            // Save a reference to avoid stripping its prototype.
                            console.warn(
                                `[BrickEngine] Property '${key}' is a complex object without a clone() or copy() method. A reference will be saved. State reset might not work for its internal properties.`,
                            );
                            initialValue = value;
                        }
                    } else {
                        initialValue = value;
                    }
                    console.log('capturing property', key, initialValue);
                } catch (e) {
                    console.error(
                        `Failed to clone property '${key}' (value: ${String(value)}). Saving reference instead. Reset may not work as expected for this property. Error:`,
                        e,
                    );
                }
                this._initialState.set(key, initialValue);
            }
        });
    }

    /**
     * Re-assigns the securely cloned caching snapshot values strictly bypassing getter mutation restrictions.
     *
     * @param {object} instance - The active object intended to be hard reset entirely.
     * @returns {void} Returns nothing.
     */
    restoreInitialState(instance: object): void {
        console.log('restoring initial snapshot');
        this._initialState.forEach((value, key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (instance as any)[key] = value;
            console.log('restoring property', key, value);
        });
    }
}
