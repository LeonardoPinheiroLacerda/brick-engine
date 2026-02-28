import { ControlEventType, ControlKey } from '../types/Types';
import { Control } from '../types/modules';
import configs from '../../config/configs';

/**
 * Utility responsible for standardizing input lifecycle and event dispatching.
 *
 * Normalizes raw hardware keyboard events or UI button clicks into abstract
 * {@link ControlKey} actions. It handles the complexity of identifying the
 * nuance between a quick "press" and a sustained "hold", offloading this
 * timer logic from the core {@link GameControl} module.
 */
export default class ControlInputHandlerHelper {
    private _control: Control;
    private _activeKeys: Map<ControlKey, { delay: NodeJS.Timeout; hold: NodeJS.Timeout }> = new Map();

    /**
     * Instantiates an active input loop handler context.
     *
     * @param {Control} control - The parent control module instance used to notify normalized events.
     */
    constructor(control: Control) {
        this._control = control;
    }

    /**
     * Processes a new physical key down or virtual button press interaction.
     *
     * Triggers an immediate {@link ControlEventType.PRESSED} event, and schedules
     * a continuous {@link ControlEventType.HELD} loop interval if the key remains
     * actively depressed past the configuration threshold.
     *
     * @param {ControlKey} key - The identity of the abstract control key being activated.
     * @returns {void} Returns nothing.
     */
    handlePress(key: ControlKey): void {
        if (this._activeKeys.has(key)) return; // Prevent double handling

        // 1. Notify Pressed
        this._control.notify(key, ControlEventType.PRESSED);

        // 2. Schedule Hold
        const delayTimer = setTimeout(() => {
            const holdTimer = setInterval(() => {
                this._control.notify(key, ControlEventType.HELD);
            }, configs.buttonHold.holdIntervalMs);

            // Update map with hold timer
            const timers = this._activeKeys.get(key);
            if (timers) {
                timers.hold = holdTimer;
            }
        }, configs.buttonHold.holdDelayMs);

        this._activeKeys.set(key, { delay: delayTimer, hold: null });
    }

    /**
     * Stops tracking an active key interaction upon physical or virtual release.
     *
     * Cancels any pending hold delay timers and cleanly wipes the active key
     * state from memory to stop {@link ControlEventType.HELD} events from firing.
     *
     * @param {ControlKey} key - The identity of the abstract control key being released.
     * @returns {void} Returns nothing.
     */
    handleRelease(key: ControlKey): void {
        const timers = this._activeKeys.get(key);
        if (timers) {
            clearTimeout(timers.delay);
            if (timers.hold) {
                clearInterval(timers.hold);
            }
            this._activeKeys.delete(key);
        }
    }
}
