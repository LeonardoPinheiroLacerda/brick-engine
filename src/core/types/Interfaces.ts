import { State } from './modules';
import { RendererMetrics } from './Types';

/**
 * Defines a contract for modules that require an initialization step.
 */
export interface Initializable {
    /**
     * Initializes the module.
     * Should be called after the instance is created and dependencies are injected.
     */
    setup(): void;
}

/**
 * Defines a contract for modules that need to synchronize with the global game state.
 * This is primarily used for persistence and state reactivity.
 */
export interface StateSyncable {
    /** Reference to the central state module. */
    _state: State;

    /**
     * Binds the module to the game state.
     *
     * @param {State} state - The game state instance to sync with.
     */
    syncState(state: State): void;
}

/**
 * Defines a contract for renderers that require initialization with layout metrics.
 */
export interface RendererInitializable {
    /**
     * Initializes the renderer with calculated screen metrics.
     *
     * @param {RendererMetrics} rendererMetrics - The layout metrics (dimensions, origins).
     */
    setup(rendererMetrics: RendererMetrics): void;
}

/**
 * Defines a contract for modules that expose internal data to the debug overlay.
 */
export interface Debuggable {
    /**
     * Retrieves key-multivalue pairs of debug information.
     *
     * @returns {Record<string, string | number | boolean>} A dictionary of debug data.
     */
    getDebugData(): Record<string, string | number | boolean>;
}
