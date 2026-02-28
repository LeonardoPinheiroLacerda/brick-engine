import p5 from 'p5';

/**
 * Global singleton context responsible for exposing the rendering engine instance.
 *
 * Designed to decouple the rendering logic from the core game state and input
 * processing. By providing a centralized, read-only access point to the `p5`
 * instance, it eliminates the need to pass the `p5` object via dependency
 * injection down to every component, view, and layout throughout the architecture.
 */
export default class RendererContext {
    private static _p: p5;

    /**
     * Initializes the global renderer context with the active p5 instance.
     *
     * This method is designed to be called exactly once during the application
     * startup lifecycle, typically by the engine's entry point. It stores the
     * `p5` object internally. If called multiple times, it safely ignores subsequent
     * calls and emits a console warning to prevent accidental overwrites of the
     * core rendering capabilities.
     *
     * @param {p5} pInstance - The active, initialized `p5` instance that will be shared across the application.
     * @returns {void} Returns nothing.
     */
    static init(pInstance: p5): void {
        if (this._p) {
            console.warn('[BrickEngine] RendererContext is already initialized. Ignoring subsequent initialization.');
            return;
        }
        this._p = pInstance;
    }

    /**
     * Retrieves the globally available p5 instance.
     *
     * Acts as the primary access point for any drawing or rendering operation across
     * the application ecosystem. UI Components and Renderers should access `p` from
     * this context to perform canvas updates safely.
     *
     * @throws {Error} Thrown if this getter is accessed before the `init` method has been successfully executed, preventing silent failures during render cycles.
     * @returns {p5} The active, initialized `p5` instance.
     */
    static get p(): p5 {
        if (!this._p) {
            throw new Error('RendererContext not initialized yet. Ensure the Game object has been created.');
        }
        return this._p;
    }

    /**
     * Resets the safely stored global p5 context.
     *
     * Used strictly to support test isolation. It clears the singleton state
     * internally to ensure that unit tests utilizing virtual `p5` mock instances
     * can be created and torn down reliably across test suites without retaining
     * state from previous executions.
     *
     * @returns {void} Returns nothing.
     */
    static reset(): void {
        this._p = undefined as unknown as p5;
    }
}
