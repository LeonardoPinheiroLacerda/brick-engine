import P5 from 'p5';

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

// prettier-ignore
/**
 * Responsible for rendering the game body and handling control events.
 *
 * This class acts as the main view controller, orchestrating the layout,
 * styles, and user interaction (clicks and holds) for the game.
 *
 * @class
 */
export default class GameView {
    private _onOffBtn         : P5.Element;
    private _startPauseBtn    : P5.Element;
    private _soundBtn         : P5.Element;
    private _resetBtn         : P5.Element;
    private _exitBtn          : P5.Element;
    private _enableColorBtn   : P5.Element;

    private _upBtn            : P5.Element;
    private _downBtn          : P5.Element;
    private _rightBtn         : P5.Element;
    private _leftBtn          : P5.Element;

    private _actionBtn        : P5.Element;

    private _parent           : HTMLElement;
    private _p                : P5;
    private _inputHandler     : ControlInputHandler;

    /**
     * Creates an instance of GameView.
     *
     * @param p - The P5 instance used for rendering and event handling.
     * @param parent - The DOM element where the game view will be attached.
     */
    constructor(p: P5, parent: HTMLElement) {
        this._parent = parent;
        this._p = p;
    }

    /**
     * Builds the visual structure of the game.
     *
     * It initializes themes, layouts (frames, containers, buttons), and calculates responsive dimensions.
     *
     * @returns An object containing the canvas element and its explicit dimensions.
     * - canvas: The P5 element for the canvas.
     * - canvasWidth: The calculated width of the canvas.
     * - canvasHeight: The calculated height of the canvas.
     */
    build() {
        applyColors();

        //Container
        const { container, height, width } = ContainerLayout(this._p, this._parent);

        //Frame
        const frame = FrameLayout(this._p, container);

        //Canvas
        const { canvas, canvasHeight, canvasWidth } = Canvas(this._p, frame, width);

        //Buttons
        const {
            largeButtonContainer,
            smallButtonContainer,
            directionHorizontalContainer,
            directionVerticalContainer,
        } = ButtonLayout(this._p, container);

        //System buttons
        this._onOffBtn        = SmallButton(this._p, smallButtonContainer    , 'On<br/>Off'        , true);
        this._startPauseBtn   = SmallButton(this._p, smallButtonContainer    , 'Start<br/>Pause'   , false);
        this._soundBtn        = SmallButton(this._p, smallButtonContainer    , 'Sound'             , true);
        this._resetBtn        = SmallButton(this._p, smallButtonContainer    , 'Reset'             , false);
        this._exitBtn         = SmallButton(this._p, smallButtonContainer    , 'Exit'              , true);
        this._enableColorBtn  = SmallButton(this._p, smallButtonContainer    , 'Enable<br/>Colors' , false);

        //Direction buttons
        this._upBtn           = Button(this._p, directionVerticalContainer   , 'UP');
        this._leftBtn         = Button(this._p, directionHorizontalContainer , 'LEFT');
        this._downBtn         = Button(this._p, directionVerticalContainer   , 'DOWN');
        this._rightBtn        = Button(this._p, directionHorizontalContainer , 'RIGHT');

        //Action button
        this._actionBtn       = BigButton(this._p, largeButtonContainer      , 'Action');

        //Set dimensions
        dimensions(width, height, canvasWidth, canvasHeight);

        //Hide splash screen
        this._hideSplash();

        return { canvas, canvasWidth, canvasHeight };
    }

    /**
     * Binds game control events to the view buttons.
     *
     * Connects click and hold events from the UI buttons to the game logic controllers.
     *
     * @param control - The control module instance.
     */
    bound(control: Control) {
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
     * Unbinds all events from the view buttons.
     *
     * Replaces all event listeners with empty functions to prevent interaction
     * (e.g., when the game is paused or stopped).
     */
    unbound() {
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
     * Helper method to bind press and release events using ControlInputHandler.
     *
     * @param btn - The P5 button element to bind.
     * @param key - The control key to notify.
     */
    private _bindButtonEvents(btn: P5.Element, key: ControlKey) {
        btn.mousePressed(() => this._inputHandler.handlePress(key));
        btn.mouseReleased(() => this._inputHandler.handleRelease(key));
        // Also handle mouseOut as release to prevent stuck keys if cursor leaves button
        btn.mouseOut(() => this._inputHandler.handleRelease(key));
    }

    /**
     * Helper method to hide the splash screen after a delay.
     *
     * @param delay - The delay in milliseconds (defaults to `configs.viewLayout.splashHideDelayMs`).
     */
    private _hideSplash(delay = configs.viewLayout.splashHideDelayMs) {
        const splash: HTMLDivElement = document.querySelector(configs.selectors.splash);
        setTimeout(() => {
            splash.style.display = 'none';
        }, delay);
    }
}
