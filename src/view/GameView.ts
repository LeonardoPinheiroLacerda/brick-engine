import P5 from 'p5';

import applyColors from './theme/applyColors';
import dimensions from './theme/dimensions';

import ButtonLayout from './components/layout/ButtonLayout';
import ContainerLayout from './components/layout/ContainerLayout';
import FrameLayout from './components/layout/FrameLayout';

import BigButton from './components/ui/BigButton';
import Button from './components/ui/Button';
import Canvas from './components/ui/Canvas';
import SmallButton from './components/ui/SmallButton';

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
    private onOffBtn         : P5.Element;
    private startPauseBtn    : P5.Element;
    private soundBtn         : P5.Element;
    private resetBtn         : P5.Element;
    private exitBtn          : P5.Element;
    private enableColorBtn   : P5.Element;

    private upBtn            : P5.Element;
    private downBtn          : P5.Element;
    private rightBtn         : P5.Element;
    private leftBtn          : P5.Element;

    private actionBtn        : P5.Element;

    private pressOnOff       : (game: any) => void;
    private pressStartPause  : (game: any) => void;
    private pressSound       : (game: any) => void;
    private pressReset       : (game: any) => void;
    private pressExit        : (game: any) => void;
    private pressEnableColor : (game: any) => void;

    private pressUp          : (game: any) => void;
    private pressDown        : (game: any) => void;
    private pressRight       : (game: any) => void;
    private pressLeft        : (game: any) => void;

    private pressAction      : (game: any) => void;

    private parent           : HTMLElement;
    private p                : P5;

    /**
     * Creates an instance of GameView.
     *
     * @param {P5} p - The P5 instance used for rendering and event handling.
     * @param {HTMLElement} parent - The DOM element where the game view will be attached.
     */
    constructor(p: P5, parent: HTMLElement) {
        this.parent = parent;
        this.p = p;
    }

    /**
     * Builds the visual structure of the game.
     *
     * It initializes themes, layouts (frames, containers, buttons), and calculates responsive dimensions.
     *
     * @returns {object} An object containing the canvas element and its explicit dimensions.
     * - canvas: The P5 element for the canvas.
     * - canvasWidth: The calculated width of the canvas.
     * - canvasHeight: The calculated height of the canvas.
     */
    build() {
        applyColors();

        //Container
        const { container, height, width } = ContainerLayout(this.p, this.parent);

        //Frame
        const frame = FrameLayout(this.p, container);

        //Canvas
        const { canvas, canvasHeight, canvasWidth } = Canvas(this.p, frame, width);

        //Buttons
        const {
            largeButtonContainer,
            smallButtonContainer,
            directionHorizontalContainer,
            directionVerticalContainer,
        } = ButtonLayout(this.p, container);

        //System buttons
        this.onOffBtn        = SmallButton(this.p, smallButtonContainer    , 'On<br/>Off'        , true);
        this.startPauseBtn   = SmallButton(this.p, smallButtonContainer    , 'Start<br/>Pause'   , false);
        this.soundBtn        = SmallButton(this.p, smallButtonContainer    , 'Sound'             , true);
        this.resetBtn        = SmallButton(this.p, smallButtonContainer    , 'Reset'             , false);
        this.exitBtn         = SmallButton(this.p, smallButtonContainer    , 'Exit'              , true);
        this.enableColorBtn  = SmallButton(this.p, smallButtonContainer    , 'Enable<br/>Colors' , false);

        //Direction buttons
        this.upBtn           = Button(this.p, directionVerticalContainer   , 'UP');
        this.leftBtn         = Button(this.p, directionHorizontalContainer , 'LEFT');
        this.downBtn         = Button(this.p, directionVerticalContainer   , 'DOWN');
        this.rightBtn        = Button(this.p, directionHorizontalContainer , 'RIGHT');

        //Action button
        this.actionBtn       = BigButton(this.p, largeButtonContainer      , 'Action');

        dimensions(width, height, canvasWidth, canvasHeight);

        return { canvas, canvasWidth, canvasHeight };
    }

    /**
     * Binds game control events to the view buttons.
     *
     * Connects click and hold events from the UI buttons to the game logic controllers.
     *
     * @param {any} game - The game instance containing the control logic and state methods.
     */
    bound(game: any) {

        // Attach events
        this.pressOnOff        = game.gameControls.pressOnOff;
        this.pressStartPause   = game.gameControls.pressStartPause;
        this.pressSound        = game.gameControls.pressSound;
        this.pressReset        = game.gameControls.pressReset;
        this.pressExit         = game.gameControls.pressExit;
        this.pressEnableColor  = game.gameControls.pressEnableColor;
        this.pressUp           = game.gameControls.pressUp;
        this.pressDown         = game.gameControls.pressDown;
        this.pressRight        = game.gameControls.pressRight;
        this.pressLeft         = game.gameControls.pressLeft;
        this.pressAction       = game.gameControls.pressAction;

        //Click
        this.onOffBtn.mouseClicked(()       => this.pressOnOff(game));
        this.startPauseBtn.mouseClicked(()  => this.pressStartPause(game));
        this.soundBtn.mouseClicked(()       => this.pressSound(game));
        this.resetBtn.mouseClicked(()       => this.pressReset(game));
        this.exitBtn.mouseClicked(()        => this.pressExit(game));
        this.enableColorBtn.mouseClicked(() => this.pressEnableColor(game));
        this.upBtn.mouseClicked(()          => this.pressUp(game));
        this.downBtn.mouseClicked(()        => this.pressDown(game));
        this.rightBtn.mouseClicked(()       => this.pressRight(game));
        this.leftBtn.mouseClicked(()        => this.pressLeft(game));
        this.actionBtn.mouseClicked(()      => this.pressAction(game));

        //On hold
        this.bindHoldAction(this.upBtn       , () => this.pressUp(game));
        this.bindHoldAction(this.downBtn     , () => this.pressDown(game));
        this.bindHoldAction(this.rightBtn    , () => this.pressRight(game));
        this.bindHoldAction(this.leftBtn     , () => this.pressLeft(game));
        this.bindHoldAction(this.actionBtn   , () => this.pressAction(game));
    }

    /**
     * Unbinds all events from the view buttons.
     *
     * Replaces all event listeners with empty functions to prevent interaction
     * (e.g., when the game is paused or stopped).
     */
    unbound() {
        this.onOffBtn.mouseClicked(()        => {});
        this.startPauseBtn.mouseClicked(()   => {});
        this.soundBtn.mouseClicked(()        => {});
        this.resetBtn.mouseClicked(()        => {});
        this.exitBtn.mouseClicked(()         => {});
        this.enableColorBtn.mouseClicked(()  => {});

        this.upBtn.mouseClicked(()           => {});
        this.downBtn.mouseClicked(()         => {});
        this.rightBtn.mouseClicked(()        => {});
        this.leftBtn.mouseClicked(()         => {});

        this.actionBtn.mouseClicked(()       => {});

        this.upBtn.mousePressed(()           => {});
        this.upBtn.mouseReleased(()          => {});

        this.downBtn.mousePressed(()         => {});
        this.downBtn.mouseReleased(()        => {});

        this.rightBtn.mousePressed(()        => {});
        this.rightBtn.mouseReleased(()       => {});

        this.leftBtn.mousePressed(()         => {});
        this.leftBtn.mouseReleased(()        => {});

        this.actionBtn.mousePressed(()       => {});
        this.actionBtn.mouseReleased(()      => {});
    }

    /**
     * Helper method to bind a "hold" action to a button.
     *
     * It sets up a sequence where pressing the button triggers a delayed start,
     * followed by a repeated action execution (interval) while the button is held down.
     * Releasing the button clears both timers.
     *
     * @param {P5.Element} btn - The P5 button element to bind.
     * @param {() => void} action - The function to execute repeatedly while the button is held.
     */
    private bindHoldAction(btn: P5.Element, action: () => void) {
        let delayTimer: NodeJS.Timeout;
        let holdTimer: NodeJS.Timeout;

        btn.mousePressed(() => {
            delayTimer = setTimeout(() => {
                holdTimer = setInterval(action, 50);
            }, 250);
        });

        btn.mouseReleased(() => {
            clearTimeout(delayTimer);
            clearTimeout(holdTimer);
        });
    }
}
