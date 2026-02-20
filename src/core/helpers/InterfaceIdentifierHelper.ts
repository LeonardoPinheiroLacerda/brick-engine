import GameState from '../module/state/GameState';
import { Debuggable, Initializable, StateSyncable } from '../types/Interfaces';
import { Serializable } from '../../types/interfaces';

export default class InterfaceIdentifierHelper {
    static isSerializable(module: object): module is Serializable {
        if (module === null || module === undefined) return false;

        const serializable = module as Serializable;

        const hasSerialize = typeof serializable.serialize === 'function';
        const hasDeserialize = typeof serializable.deserialize === 'function';
        const hasSerialId = typeof serializable.serialId === 'string';

        return hasSerialize && hasDeserialize && hasSerialId;
    }

    static isInitializable(module: object): module is Initializable {
        if (module === null || module === undefined) return false;

        const initializable = module as Initializable;

        return typeof initializable.setup === 'function';
    }

    static isStateSyncable(module: object): module is StateSyncable {
        if (module === null || module === undefined) return false;

        const stateSyncable = module as StateSyncable;

        const hasSyncState = typeof stateSyncable.syncState === 'function';
        const isGameState = stateSyncable instanceof GameState;

        return hasSyncState && !isGameState;
    }

    static isDebuggable(module: object): module is Debuggable {
        if (module === null || module === undefined) return false;

        const debuggable = module as Debuggable;

        return typeof debuggable.getDebugData === 'function';
    }
}
