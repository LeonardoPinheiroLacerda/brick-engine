export default class InitialStateSnapshot {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _initialState: Map<string, any> = new Map();
    private _baseProperties: string[] = [];

    /**
     * Captures the base properties of the instance before any custom client properties are added.
     * @param instance The object instance to extract keys from.
     */
    captureBaseProperties(instance: object): void {
        this._baseProperties = Object.keys(instance);
    }

    /**
     * Stores the initial state of custom client properties.
     * @param instance The object instance containing custom properties.
     */
    captureInitialState(instance: object): void {
        console.log('capturing initial state for snapshot');
        Object.entries(instance).forEach(([key, value]) => {
            if (!this._baseProperties.includes(key) && typeof value !== 'function') {
                let initialValue = value;
                try {
                    initialValue = structuredClone(value);
                    console.log('capturing property', key, initialValue);
                } catch (e) {
                    console.error(`Failed to clone property ${key}:`, e);
                }
                this._initialState.set(key, initialValue);
            }
        });
    }

    /**
     * Restores the captured custom properties back to the instance.
     * @param instance The object instance to restore properties onto.
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
