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
        //System buttons
        this._onOffBtn      .mouseClicked(()       => control.notify(ControlKey.POWER      , 'pressed'));
        this._startPauseBtn .mouseClicked(()       => control.notify(ControlKey.START_PAUSE, 'pressed'));
        this._soundBtn      .mouseClicked(()       => control.notify(ControlKey.SOUND      , 'pressed'));
        this._resetBtn      .mouseClicked(()       => control.notify(ControlKey.RESET      , 'pressed'));
        this._exitBtn       .mouseClicked(()       => control.notify(ControlKey.EXIT       , 'pressed'));
        this._enableColorBtn.mouseClicked(()       => control.notify(ControlKey.COLOR      , 'pressed'));

        //Direction buttons
        this._upBtn         .mouseClicked(()       => control.notify(ControlKey.UP         , 'pressed'));
        this._downBtn       .mouseClicked(()       => control.notify(ControlKey.DOWN       , 'pressed'));
        this._rightBtn      .mouseClicked(()       => control.notify(ControlKey.RIGHT      , 'pressed'));
        this._leftBtn       .mouseClicked(()       => control.notify(ControlKey.LEFT       , 'pressed'));

        //Action button
        this._actionBtn     .mouseClicked(()       => control.notify(ControlKey.ACTION     , 'pressed'));

        //On hold
        //System buttons
        this._bindHeldEvent(this._onOffBtn      , ControlKey.POWER      , control);
        this._bindHeldEvent(this._startPauseBtn , ControlKey.START_PAUSE, control);
        this._bindHeldEvent(this._soundBtn      , ControlKey.SOUND      , control);
        this._bindHeldEvent(this._resetBtn      , ControlKey.RESET      , control);
        this._bindHeldEvent(this._exitBtn       , ControlKey.EXIT       , control);
        this._bindHeldEvent(this._enableColorBtn, ControlKey.COLOR      , control);

        //Direction buttons
        this._bindHeldEvent(this._upBtn         , ControlKey.UP         , control);
        this._bindHeldEvent(this._downBtn       , ControlKey.DOWN       , control);
        this._bindHeldEvent(this._rightBtn      , ControlKey.RIGHT      , control);
        this._bindHeldEvent(this._leftBtn       , ControlKey.LEFT       , control);

        //Action button
        this._bindHeldEvent(this._actionBtn     , ControlKey.ACTION     , control);
    }

    /**
     * Unbinds all events from the view buttons.
     *
     * Replaces all event listeners with empty functions to prevent interaction
     * (e.g., when the game is paused or stopped).
     */
    unbound() {
        this._onOffBtn      .mouseClicked(()       => {});
        this._startPauseBtn .mouseClicked(()       => {});
        this._soundBtn      .mouseClicked(()       => {});
        this._resetBtn      .mouseClicked(()       => {});
        this._exitBtn       .mouseClicked(()       => {});
        this._enableColorBtn.mouseClicked(()       => {});

        this._upBtn         .mouseClicked(()       => {});
        this._downBtn       .mouseClicked(()       => {});
        this._rightBtn      .mouseClicked(()       => {});
        this._leftBtn       .mouseClicked(()       => {});

        this._actionBtn     .mouseClicked(()       => {});

        this._upBtn         .mousePressed(()       => {});
        this._upBtn         .mouseReleased(()      => {});

        this._downBtn       .mousePressed(()       => {});
        this._downBtn       .mouseReleased(()      => {});

        this._rightBtn      .mousePressed(()       => {});
        this._rightBtn      .mouseReleased(()      => {});

        this._leftBtn       .mousePressed(()       => {});
        this._leftBtn       .mouseReleased(()      => {});

        this._actionBtn     .mousePressed(()       => {});
        this._actionBtn     .mouseReleased(()      => {});
    }

    /**
     * Helper method to bind a "hold" action to a button.
     *
     * It sets up a sequence where pressing the button triggers a delayed start,
     * followed by a repeated action execution (interval) while the button is held down,
     * using `configs.buttonHold.holdIntervalMs` and `configs.buttonHold.holdDelayMs`.
     * Releasing the button clears both timers.
     *
     * @param btn - The P5 button element to bind.
     * @param key - The control key to notify.
     * @param control - The control module instance.
     */
    private _bindHeldEvent(btn: P5.Element, key: ControlKey, control: Control) {
        let delayTimer: NodeJS.Timeout;
        let holdTimer: NodeJS.Timeout;

        btn.mousePressed(() => {
            delayTimer = setTimeout(() => {
                holdTimer = setInterval(() => control.notify(key, 'held'), configs.buttonHold.holdIntervalMs);
            }, configs.buttonHold.holdDelayMs);
        });

        btn.mouseReleased(() => {
            clearTimeout(delayTimer);
            clearTimeout(holdTimer);
        });
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
