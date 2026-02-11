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

import Game from '../core/Game';

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

    private _pressOnOff       : (game: Game) => void;
    private _pressStartPause  : (game: Game) => void;
    private _pressSound       : (game: Game) => void;
    private _pressReset       : (game: Game) => void;
    private _pressExit        : (game: Game) => void;
    private _pressEnableColor : (game: Game) => void;

    private _pressUp          : (game: Game) => void;
    private _pressDown        : (game: Game) => void;
    private _pressRight       : (game: Game) => void;
    private _pressLeft        : (game: Game) => void;

    private _pressAction      : (game: Game) => void;

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
        this.hideSplash();

        return { canvas, canvasWidth, canvasHeight };
    }

    /**
     * Binds game control events to the view buttons.
     *
     * Connects click and hold events from the UI buttons to the game logic controllers.
     *
     * @param game - The game instance containing the control logic and state methods.
     */
    bound(game: Game) {

        // Attach events
        this._pressOnOff        = game.gameControls.pressOnOff;
        this._pressStartPause   = game.gameControls.pressStartPause;
        this._pressSound        = game.gameControls.pressSound;
        this._pressReset        = game.gameControls.pressReset;
        this._pressExit         = game.gameControls.pressExit;
        this._pressEnableColor  = game.gameControls.pressEnableColor;
        this._pressUp           = game.gameControls.pressUp;
        this._pressDown         = game.gameControls.pressDown;
        this._pressRight        = game.gameControls.pressRight;
        this._pressLeft         = game.gameControls.pressLeft;
        this._pressAction       = game.gameControls.pressAction;

        //Click
        this._onOffBtn.mouseClicked(()       => this._pressOnOff(game));
        this._startPauseBtn.mouseClicked(()  => this._pressStartPause(game));
        this._soundBtn.mouseClicked(()       => this._pressSound(game));
        this._resetBtn.mouseClicked(()       => this._pressReset(game));
        this._exitBtn.mouseClicked(()        => this._pressExit(game));
        this._enableColorBtn.mouseClicked(() => this._pressEnableColor(game));
        this._upBtn.mouseClicked(()          => this._pressUp(game));
        this._downBtn.mouseClicked(()        => this._pressDown(game));
        this._rightBtn.mouseClicked(()       => this._pressRight(game));
        this._leftBtn.mouseClicked(()        => this._pressLeft(game));
        this._actionBtn.mouseClicked(()      => this._pressAction(game));

        //On hold
        this.bindHoldAction(this._upBtn       , () => this._pressUp(game));
        this.bindHoldAction(this._downBtn     , () => this._pressDown(game));
        this.bindHoldAction(this._rightBtn    , () => this._pressRight(game));
        this.bindHoldAction(this._leftBtn     , () => this._pressLeft(game));
        this.bindHoldAction(this._actionBtn   , () => this._pressAction(game));
    }

    /**
     * Unbinds all events from the view buttons.
     *
     * Replaces all event listeners with empty functions to prevent interaction
     * (e.g., when the game is paused or stopped).
     */
    unbound() {
        this._onOffBtn.mouseClicked(()        => {});
        this._startPauseBtn.mouseClicked(()   => {});
        this._soundBtn.mouseClicked(()        => {});
        this._resetBtn.mouseClicked(()        => {});
        this._exitBtn.mouseClicked(()         => {});
        this._enableColorBtn.mouseClicked(()  => {});

        this._upBtn.mouseClicked(()           => {});
        this._downBtn.mouseClicked(()         => {});
        this._rightBtn.mouseClicked(()        => {});
        this._leftBtn.mouseClicked(()         => {});

        this._actionBtn.mouseClicked(()       => {});

        this._upBtn.mousePressed(()           => {});
        this._upBtn.mouseReleased(()          => {});

        this._downBtn.mousePressed(()         => {});
        this._downBtn.mouseReleased(()        => {});

        this._rightBtn.mousePressed(()        => {});
        this._rightBtn.mouseReleased(()       => {});

        this._leftBtn.mousePressed(()         => {});
        this._leftBtn.mouseReleased(()        => {});

        this._actionBtn.mousePressed(()       => {});
        this._actionBtn.mouseReleased(()      => {});
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
     * @param action - The function to execute repeatedly while the button is held.
     */
    private bindHoldAction(btn: P5.Element, action: () => void) {
        let delayTimer: NodeJS.Timeout;
        let holdTimer: NodeJS.Timeout;

        btn.mousePressed(() => {
            delayTimer = setTimeout(() => {
                holdTimer = setInterval(action, configs.buttonHold.holdIntervalMs);
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
    private hideSplash(delay = configs.viewLayout.splashHideDelayMs) {
        const splash: HTMLDivElement = document.querySelector(configs.selectors.splash);
        setTimeout(() => {
            splash.style.display = 'none';
        }, delay);
    }
}
