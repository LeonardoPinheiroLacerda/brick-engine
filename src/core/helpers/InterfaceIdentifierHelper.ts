import GameState from '../module/state/GameState';
import { Debuggable, Initializable, StateSyncable, Serializable } from '../types/Interfaces';

/**
 * Type guard utility for runtime interface identification of engine modules.
 *
 * TypeScript interfaces are erased at compile-time. This class provides the
 * architectural capability to perform dynamic feature discovery during the
 * engine's bootstrap and serialization phases (e.g. checking if a registered
 * module supports state syncing) by duck-typing the expected method contracts.
 */
export default class InterfaceIdentifierHelper {
    /**
     * Determines whether a given module implements the {@link Serializable} interface.
     *
     * @param {object} module - The generic module instance to inspect.
     * @returns {boolean} True if the module fulfills the contract (has `serialize`, `deserialize`, and `serialId`).
     */
    static isSerializable(module: object): module is Serializable {
        if (module === null || module === undefined) return false;

        const serializable = module as Serializable;

        const hasSerialize = typeof serializable.serialize === 'function';
        const hasDeserialize = typeof serializable.deserialize === 'function';
        const hasSerialId = typeof serializable.serialId === 'string';

        return hasSerialize && hasDeserialize && hasSerialId;
    }

    /**
     * Determines whether a given module implements the {@link Initializable} interface.
     *
     * @param {object} module - The generic module instance to inspect.
     * @returns {boolean} True if the module exposes a valid `setup` phase function.
     */
    static isInitializable(module: object): module is Initializable {
        if (module === null || module === undefined) return false;

        const initializable = module as Initializable;

        return typeof initializable.setup === 'function';
    }

    /**
     * Determines whether a given module implements the {@link StateSyncable} interface.
     *
     * Explicitly ignores the {@link GameState} itself to prevent cyclical sync loops.
     *
     * @param {object} module - The generic module instance to inspect.
     * @returns {boolean} True if the module exposes a `syncState` function and is NOT the core `GameState`.
     */
    static isStateSyncable(module: object): module is StateSyncable {
        if (module === null || module === undefined) return false;

        const stateSyncable = module as StateSyncable;

        const hasSyncState = typeof stateSyncable.syncState === 'function';
        const isGameState = stateSyncable instanceof GameState;

        return hasSyncState && !isGameState;
    }

    /**
     * Determines whether a given module implements the {@link Debuggable} interface.
     *
     * @param {object} module - The generic module instance to inspect.
     * @returns {boolean} True if the module provides a `getDebugData` function payload.
     */
    static isDebuggable(module: object): module is Debuggable {
        if (module === null || module === undefined) return false;

        const debuggable = module as Debuggable;

        return typeof debuggable.getDebugData === 'function';
    }
}
