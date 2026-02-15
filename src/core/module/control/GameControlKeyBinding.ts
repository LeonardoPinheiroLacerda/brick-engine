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

export default class GameControlKeyBinding {
    private _inputHandler: ControlInputHandler;

    private _boundHandleKeyDown: (event: KeyboardEvent) => void;
    private _boundHandleKeyUp: (event: KeyboardEvent) => void;

    constructor(control: Control) {
        this._inputHandler = new ControlInputHandler(control);
        this._boundHandleKeyDown = this._handleKeyDown.bind(this);
        this._boundHandleKeyUp = this._handleKeyUp.bind(this);
    }

    /**
     * Binds keyboard events to the window.
     */
    bound() {
        window.addEventListener('keydown', this._boundHandleKeyDown);
        window.addEventListener('keyup', this._boundHandleKeyUp);
    }

    /**
     * Unbinds keyboard events from the window.
     */
    unbound() {
        window.removeEventListener('keydown', this._boundHandleKeyDown);
        window.removeEventListener('keyup', this._boundHandleKeyUp);
    }

    private _handleKeyDown(event: KeyboardEvent) {
        const controlKey = DEFAULT_KEY_MAP[event.code];
        if (!controlKey) return;

        if (event.repeat) return; // Ignore native repeat, fully delegating repeat logic to InputHandler

        this._inputHandler.handlePress(controlKey);
    }

    private _handleKeyUp(event: KeyboardEvent) {
        const controlKey = DEFAULT_KEY_MAP[event.code];
        if (!controlKey) return;

        this._inputHandler.handleRelease(controlKey);
    }
}
