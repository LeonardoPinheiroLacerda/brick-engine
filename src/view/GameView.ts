import p5 from 'p5';

import configs from '../config/configs';

import applyColors from './theme/applyColors';
import dimensions from './theme/dimensions';

import ButtonLayout from './components/layout/ButtonLayout';
import ContainerLayout from './components/layout/ContainerLayout';
import FrameLayout from './components/layout/FrameLayout';

import BigButton from './components/ui/BigButton';
import Button from './components/ui/Button';
import Canvas from './components/ui/Canvas';
import SmallButton from './components/ui/SmallButton';
import { ControlKey } from '../core/types/enums';
import { Control } from '../core/types/modules';
import ControlInputHandler from '../core/helpers/ControlInputHandlerHelper';
import Debugger from './Debugger';
import { GameModules } from '../core/types/Types';
import SessionModal from './SessionModal';

// prettier-ignore
/**
 * Central UI module bridging logical game states to responsive DOM elements.
 *
 * It serves as the single source of truth for the HTML structure, mapping physical user clicks
 * safely down into Engine abstraction events. By orchestrating everything from Canvas instantiation
 * to system Menus, it ensures strictly isolated interactions between the browser window and core logic.
 */
export default class GameView {
    private _onOffBtn         : p5.Element;
    private _startPauseBtn    : p5.Element;
    private _soundBtn         : p5.Element;
    private _resetBtn         : p5.Element;
    private _exitBtn          : p5.Element;
    private _enableColorBtn   : p5.Element;

    private _upBtn            : p5.Element;
    private _downBtn          : p5.Element;
    private _rightBtn         : p5.Element;
    private _leftBtn          : p5.Element;

    private _actionBtn        : p5.Element;

    private _parent           : HTMLElement;
    private _inputHandler     : ControlInputHandler;

    private _cachedCanvas     : { canvas: p5.Element; canvasWidth: number; canvasHeight: number };

    private _debugger         : Debugger;
    private _sessionModal     : SessionModal;

    /**
     * Bootstraps the root listener binding it to a persistent layout container.
     *
     * @param {HTMLElement} parent - The DOM element where the game view will be attached.
     */
    constructor(parent: HTMLElement) {
        this._parent = parent;
    }

    /**
     * Verifies if the physical Canvas context has successfully mounted into the Document structure.
     *
     * @returns {boolean} True if the game body has been built, false otherwise.
     */
    isBodyBuilt() {
        return this._cachedCanvas != null;
    }

    /**
     * Builds the visual structure of the game.
     *
     * It initializes themes, layouts (frames, containers, buttons), and calculates responsive dimensions.
     *
     * @returns An object containing the canvas element and its explicit dimensions.
     * - canvas: The p5 element for the canvas.
     * - canvasWidth: The calculated width of the canvas.
     * - canvasHeight: The calculated height of the canvas.
     */
    build() {

        if(this._cachedCanvas) {
            return this._cachedCanvas;
        }

        applyColors();

        //Container
        const { container, height, width } = ContainerLayout(this._parent);

        //Frame
        const frame = FrameLayout(container);

        //Canvas
        const { canvas, canvasHeight, canvasWidth } = Canvas(frame, width);

        //Buttons
        const {
            largeButtonContainer,
            smallButtonContainer,
            directionHorizontalContainer,
            directionVerticalContainer,
        } = ButtonLayout(container);

        //System buttons
        this._onOffBtn        = SmallButton(smallButtonContainer    , 'On<br/>Off'        , true);
        this._startPauseBtn   = SmallButton(smallButtonContainer    , 'Start<br/>Pause'   , false);
        this._soundBtn        = SmallButton(smallButtonContainer    , 'Sound'             , true);
        this._resetBtn        = SmallButton(smallButtonContainer    , 'Reset'             , false);
        this._exitBtn         = SmallButton(smallButtonContainer    , 'Exit'              , true);
        this._enableColorBtn  = SmallButton(smallButtonContainer    , 'Enable<br/>Colors' , false);

        //Direction buttons
        this._upBtn           = Button(directionVerticalContainer   , 'UP');
        this._leftBtn         = Button(directionHorizontalContainer , 'LEFT');
        this._downBtn         = Button(directionVerticalContainer   , 'DOWN');
        this._rightBtn        = Button(directionHorizontalContainer , 'RIGHT');

        //Action button
        this._actionBtn       = BigButton(largeButtonContainer      , 'Action');

        //Set dimensions
        dimensions(width, height, canvasWidth, canvasHeight);

        //Hide splash screen
        this._hideSplash();

        this._cachedCanvas = { canvas, canvasWidth, canvasHeight };
        return this._cachedCanvas;
    }

    /**
     * Injects the strictly structured overlay handling interrupted restoration flows.
     *
     * @returns {void} Returns nothing.
     */
    setupSessionModal() {
        this._sessionModal = new SessionModal();
        this._sessionModal.setup();
    }

    /**
     * Invokes the blocking popup intercepting control until the User forces a choice.
     *
     * @param {function(): void} onConfirm - The mapped execution sequence if the dialog is accepted.
     * @param {function(): void} onCancel - The mapped execution sequence if the dialog is declined.
     * @returns {void} Returns nothing.
     */
    showSessionModal(onConfirm: () => void, onCancel: () => void) {
        this._sessionModal.show(onConfirm, onCancel);
    }

    /**
     * Instantiates the technical UI diagnostics tool aggregating dynamic execution values into the DOM.
     *
     * @param {GameModules} gameModules - The specific suite of active modules evaluated by pointers.
     * @returns {void} Returns nothing.
     */
    setupDebugger(gameModules: GameModules) {
        this._debugger = new Debugger(gameModules);
        this._debugger.setup();
    }

    /**
     * Points the tracked overlay values dynamically onto a newly injected module configuration suite.
     *
     * @param {GameModules} gameModules - The collection of logically active states swapping contexts.
     * @returns {void} Returns nothing.
     */
    updateDebuggerGameModules(gameModules: GameModules) {
        this._debugger.setGameModules(gameModules);
    }

    /**
     * Forces an execution cycle translating the latest internal module variables to the DOM interface.
     *
     * @returns {void} Returns nothing.
     */
    updateDebugger() {
        this._debugger.update();
    }

    /**
     * Traps all specific DOM elements mapping pointer and mouse events directly down to engine triggers.
     *
     * @param {Control} control - The active translation gateway reading raw clicks.
     * @returns {void} Returns nothing.
     */
    bindControls(control: Control) {
        this._inputHandler = new ControlInputHandler(control);

        //System buttons
        this._bindButtonEvents(this._onOffBtn      , ControlKey.POWER);
        this._bindButtonEvents(this._startPauseBtn , ControlKey.START_PAUSE);
        this._bindButtonEvents(this._soundBtn      , ControlKey.SOUND);
        this._bindButtonEvents(this._resetBtn      , ControlKey.RESET);
        this._bindButtonEvents(this._exitBtn       , ControlKey.EXIT);
        this._bindButtonEvents(this._enableColorBtn, ControlKey.COLOR);

        //Direction buttons
        this._bindButtonEvents(this._upBtn         , ControlKey.UP);
        this._bindButtonEvents(this._downBtn       , ControlKey.DOWN);
        this._bindButtonEvents(this._rightBtn      , ControlKey.RIGHT);
        this._bindButtonEvents(this._leftBtn       , ControlKey.LEFT);

        //Action button
        this._bindButtonEvents(this._actionBtn     , ControlKey.ACTION);
    }

    /**
     * Safely disengages all listeners destroying pointer mappings across all buttons.
     *
     * @returns {void} Returns nothing.
     */
    unbindControls() {
        this._onOffBtn      .mousePressed(() => {}).mouseReleased(() => {});
        this._startPauseBtn .mousePressed(() => {}).mouseReleased(() => {});
        this._soundBtn      .mousePressed(() => {}).mouseReleased(() => {});
        this._resetBtn      .mousePressed(() => {}).mouseReleased(() => {});
        this._exitBtn       .mousePressed(() => {}).mouseReleased(() => {});
        this._enableColorBtn.mousePressed(() => {}).mouseReleased(() => {});

        this._upBtn         .mousePressed(() => {}).mouseReleased(() => {});
        this._downBtn       .mousePressed(() => {}).mouseReleased(() => {});
        this._rightBtn      .mousePressed(() => {}).mouseReleased(() => {});
        this._leftBtn       .mousePressed(() => {}).mouseReleased(() => {});

        this._actionBtn     .mousePressed(() => {}).mouseReleased(() => {});
    }

    /**
     * Helper injecting standard up/down polling loops directly onto native elements safely.
     *
     * @param {p5.Element} btn - The specific HTML reference targeted.
     * @param {ControlKey} key - The enumerated alias dispatched downstream on interaction.
     * @returns {void} Returns nothing.
     */
    private _bindButtonEvents(btn: p5.Element, key: ControlKey) {
        btn.mousePressed(() => this._inputHandler.handlePress(key));
        btn.mouseReleased(() => this._inputHandler.handleRelease(key));
        // Also handle mouseOut as release to prevent stuck keys if cursor leaves button
        btn.mouseOut(() => this._inputHandler.handleRelease(key));
    }

    /**
     * Schedules the destructive cleanup sequence fading initialization overlays away gracefully.
     *
     * @param {number} delay - The specific integer mapped in layout configs.
     * @returns {void} Returns nothing.
     */
    private _hideSplash(delay = configs.viewLayout.splashHideDelayMs) {
        const splash: HTMLDivElement = document.querySelector(configs.selectors.splash);
        setTimeout(() => {
            splash.style.display = 'none';
        }, delay);
    }
}
