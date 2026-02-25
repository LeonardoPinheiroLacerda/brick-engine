import p5 from 'p5';

/**
 * Global singleton context for the Brick Engine.
 * Provides read-only access to the p5 instance across the application.
 */
export default class RendererContext {
    private static _p: p5;

    /**
     * Initializes the RendererContext with a p5 instance.
     * Should only be called once, typically during Game initialization.
     * @param pInstance The active p5 instance.
     * @throws Error if the context has already been initialized.
     */
    static init(pInstance: p5): void {
        if (this._p) {
            console.warn('[BrickEngine] RendererContext is already initialized. Ignoring subsequent initialization.');
            return;
        }
        this._p = pInstance;
    }

    /**
     * Gets the globally available p5 instance.
     * @throws Error if the context has not been initialized yet.
     */
    static get p(): p5 {
        if (!this._p) {
            throw new Error('RendererContext not initialized yet. Ensure the Game object has been created.');
        }
        return this._p;
    }

    /**
     * Resets the context.
     * Primarily used for unit testing to clear the singleton state.
     */
    static reset(): void {
        this._p = undefined as unknown as p5;
    }
}
