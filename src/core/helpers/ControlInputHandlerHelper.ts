import { ControlEventType, ControlKey } from '../types/Types';
import { Control } from '../types/modules';
import configs from '../../config/configs';

/**
 * Helper class that standardizes input handling logic.
 * It manages the distinction between single 'press' events and continuous 'hold' events
 * for both keyboard and UI button inputs.
 */
export default class ControlInputHandlerHelper {
    private _control: Control;
    private _activeKeys: Map<ControlKey, { delay: NodeJS.Timeout; hold: NodeJS.Timeout }> = new Map();

    /**
     * Creates an instance of the input handler.
     *
     * @param {Control} control - The control module instance to notify.
     */
    constructor(control: Control) {
        this._control = control;
    }

    /**
     * Processes a key down or button press action.
     * Triggers an immediate {@link ControlEventType.PRESSED} event, and schedules
     * a {@link ControlEventType.HELD} loop if the key remains active.
     *
     * @param {ControlKey} key - The identity of the control key being pressed.
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
     * Processes a key up or button release action.
     * Cancels any pending hold timers and cleans up the active key state.
     *
     * @param {ControlKey} key - The identity of the control key being released.
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
