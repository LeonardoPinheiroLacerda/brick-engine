import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';
import ControlInputHandler from '../../helpers/ControlInputHandlerHelper';

const DEFAULT_KEY_MAP: Record<string, ControlKey> = {
    // Arrows
    ArrowUp: ControlKey.UP,
    ArrowDown: ControlKey.DOWN,
    ArrowLeft: ControlKey.LEFT,
    ArrowRight: ControlKey.RIGHT,

    // WASD
    KeyW: ControlKey.UP,
    KeyS: ControlKey.DOWN,
    KeyA: ControlKey.LEFT,
    KeyD: ControlKey.RIGHT,

    // Actions
    KeyJ: ControlKey.ACTION,

    // System
    Digit1: ControlKey.POWER,
    Digit2: ControlKey.START_PAUSE,
    Digit3: ControlKey.SOUND,
    Digit4: ControlKey.RESET,
    Digit5: ControlKey.EXIT,
    Digit6: ControlKey.COLOR,
};

/**
 * Handles the binding of physical keyboard events to logical control actions.
 * Translates Browser `KeyboardEvent`s into engine `ControlKey`s.
 */
export default class GameControlKeyBinding {
    private _inputHandler: ControlInputHandler;

    private _boundHandleKeyDown: (event: KeyboardEvent) => void;
    private _boundHandleKeyUp: (event: KeyboardEvent) => void;

    /**
     * Creates an instance of GameControlKeyBinding.
     *
     * @param {Control} control - The parent control module.
     */
    constructor(control: Control) {
        this._inputHandler = new ControlInputHandler(control);
        this._boundHandleKeyDown = this._handleKeyDown.bind(this);
        this._boundHandleKeyUp = this._handleKeyUp.bind(this);
    }

    /**
     * Binds keyboard events to the global window object.
     */
    bindControls() {
        window.addEventListener('keydown', this._boundHandleKeyDown);
        window.addEventListener('keyup', this._boundHandleKeyUp);
    }

    /**
     * Unbinds keyboard events from the global window object.
     */
    unbindControls() {
        window.removeEventListener('keydown', this._boundHandleKeyDown);
        window.removeEventListener('keyup', this._boundHandleKeyUp);
    }

    /**
     * Internal handler for key down events.
     *
     * @param {KeyboardEvent} event - The browser keyboard event.
     */
    private _handleKeyDown(event: KeyboardEvent) {
        const controlKey = DEFAULT_KEY_MAP[event.code];
        if (!controlKey) return;

        if (event.repeat) return; // Ignore native repeat, fully delegating repeat logic to InputHandler

        this._inputHandler.handlePress(controlKey);
    }

    /**
     * Internal handler for key up events.
     *
     * @param {KeyboardEvent} event - The browser keyboard event.
     */
    private _handleKeyUp(event: KeyboardEvent) {
        const controlKey = DEFAULT_KEY_MAP[event.code];
        if (!controlKey) return;

        this._inputHandler.handleRelease(controlKey);
    }
}
