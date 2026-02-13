import { ControlEventType, ControlKey } from '../types/Types';
import { Control } from '../types/modules';
import configs from '../../config/configs';

/**
 * Handles input logic for both keyboard and UI events.
 * Manages press, hold, and release states uniformly.
 */
export default class ControlInputHandlerHelper {
    private _control: Control;
    private _activeKeys: Map<ControlKey, { delay: NodeJS.Timeout; hold: NodeJS.Timeout }> = new Map();

    constructor(control: Control) {
        this._control = control;
    }

    /**
     * Handles a key press or generic press event.
     * Triggers 'pressed' immediately and schedules 'held'.
     * @param key The control key pressed.
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
     * Handles a key release event.
     * Clears any active timers for the key.
     * @param key The control key released.
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
