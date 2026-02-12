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

    constructor(control: Control) {
        this._inputHandler = new ControlInputHandler(control);
    }

    /**
     * Binds keyboard events to the window.
     */
    bound() {
        window.addEventListener('keydown', event => this._handleKeyDown(event));
        window.addEventListener('keyup', event => this._handleKeyUp(event));
    }

    /**
     * Unbinds keyboard events from the window.
     */
    unbound() {
        window.removeEventListener('keydown', event => this._handleKeyDown(event));
        window.removeEventListener('keyup', event => this._handleKeyUp(event));
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
