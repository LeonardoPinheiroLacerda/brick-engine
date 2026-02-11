import P5 from 'p5';
import defineColors from './_configs/defineColors';
import Container from './_components/Container';
import Frame from './_components/Frame';
import Canvas from './_components/Canvas';
import ButtonContainers from './_components/ButtonContainers';
import SmallButton from './_components/SmallButton';
import Button from './_components/Button';
import BigButton from './_components/BigButton';
import defineSizes from './_configs/defineSizes';

/**
 *
 * Responsable for rendering the gamebrick body, bound and unbound controls events
 *
 * @class
 */

export default class GameView {
    private onOffBtn: P5.Element;
    private startPauseBtn: P5.Element;
    private soundBtn: P5.Element;
    private resetBtn: P5.Element;
    private exitBtn: P5.Element;
    private enableColorBtn: P5.Element;

    private upBtn: P5.Element;
    private downBtn: P5.Element;
    private rightBtn: P5.Element;
    private leftBtn: P5.Element;

    private actionBtn: P5.Element;

    private pressOnOff: (game: any) => void;
    private pressStartPause: (game: any) => void;
    private pressSound: (game: any) => void;
    private pressReset: (game: any) => void;
    private pressExit: (game: any) => void;
    private pressEnableColor: (game: any) => void;

    private pressUp: (game: any) => void;
    private pressDown: (game: any) => void;
    private pressRight: (game: any) => void;
    private pressLeft: (game: any) => void;

    private pressAction: (game: any) => void;

    private parent: HTMLElement;
    private p: P5;

    constructor(p: P5, parent: HTMLElement) {
        this.parent = parent;
        this.p = p;
    }

    build() {
        defineColors();

        //Container
        const { container, height, width } = Container(this.p, this.parent);

        //Frame
        const frame = Frame(this.p, container);

        //Canvas
        const { canvas, canvasHeight, canvasWidth } = Canvas(
            this.p,
            frame,
            width,
        );

        //Buttons
        const {
            largeButtonContainer,
            smallButtonContainer,
            directionHorizontalContainer,
            directionVerticalContainer,
        } = ButtonContainers(this.p, container);

        //Small buttons
        this.onOffBtn = SmallButton(
            this.p,
            smallButtonContainer,
            'On<br/>Off',
            true,
        );
        this.startPauseBtn = SmallButton(
            this.p,
            smallButtonContainer,
            'Start<br/>Pause',
            false,
        );
        this.soundBtn = SmallButton(
            this.p,
            smallButtonContainer,
            'Sound',
            true,
        );
        this.resetBtn = SmallButton(
            this.p,
            smallButtonContainer,
            'Reset',
            false,
        );
        this.exitBtn = SmallButton(this.p, smallButtonContainer, 'Exit', true);
        this.enableColorBtn = SmallButton(
            this.p,
            smallButtonContainer,
            'Enable<br/>Colors',
            false,
        );

        this.upBtn = Button(this.p, directionVerticalContainer, 'UP');
        this.leftBtn = Button(this.p, directionHorizontalContainer, 'LEFT');
        this.downBtn = Button(this.p, directionVerticalContainer, 'DOWN');
        this.rightBtn = Button(this.p, directionHorizontalContainer, 'RIGHT');

        this.actionBtn = BigButton(this.p, largeButtonContainer, 'Action');

        defineSizes(width, height, canvasWidth, canvasHeight);

        return { canvas, canvasWidth, canvasHeight };
    }

    bound(game: any) {
        this.pressOnOff = game.gameControls.pressOnOff;
        this.pressStartPause = game.gameControls.pressStartPause;
        this.pressSound = game.gameControls.pressSound;
        this.pressReset = game.gameControls.pressReset;
        this.pressExit = game.gameControls.pressExit;
        this.pressEnableColor = game.gameControls.pressEnableColor;
        this.pressUp = game.gameControls.pressUp;
        this.pressDown = game.gameControls.pressDown;
        this.pressRight = game.gameControls.pressRight;
        this.pressLeft = game.gameControls.pressLeft;
        this.pressAction = game.gameControls.pressAction;

        //Click
        this.onOffBtn.mouseClicked(() => this.pressOnOff(game));
        this.startPauseBtn.mouseClicked(() => this.pressStartPause(game));
        this.soundBtn.mouseClicked(() => this.pressSound(game));
        this.resetBtn.mouseClicked(() => this.pressReset(game));
        this.exitBtn.mouseClicked(() => this.pressExit(game));
        this.enableColorBtn.mouseClicked(() => this.pressEnableColor(game));
        this.upBtn.mouseClicked(() => this.pressUp(game));
        this.downBtn.mouseClicked(() => this.pressDown(game));
        this.rightBtn.mouseClicked(() => this.pressRight(game));
        this.leftBtn.mouseClicked(() => this.pressLeft(game));
        this.actionBtn.mouseClicked(() => this.pressAction(game));

        //On hold
        let delayTimerOnUp: NodeJS.Timeout;
        let holdTimerOnUp: NodeJS.Timeout;
        this.upBtn.mousePressed(() => {
            delayTimerOnUp = setTimeout(() => {
                holdTimerOnUp = setInterval(() => {
                    this.pressUp(game);
                }, 50);
            }, 250);
        });
        this.upBtn.mouseReleased(() => {
            clearTimeout(delayTimerOnUp);
            clearTimeout(holdTimerOnUp);
        });

        let delayTimerOnDown: NodeJS.Timeout;
        let holdTimerOnDown: NodeJS.Timeout;
        this.downBtn.mousePressed(() => {
            delayTimerOnDown = setTimeout(() => {
                holdTimerOnDown = setInterval(() => {
                    this.pressDown(game);
                }, 50);
            }, 250);
        });
        this.downBtn.mouseReleased(() => {
            clearTimeout(delayTimerOnDown);
            clearTimeout(holdTimerOnDown);
        });

        let delayTimerOnRight: NodeJS.Timeout;
        let holdTimerOnRight: NodeJS.Timeout;
        this.rightBtn.mousePressed(() => {
            delayTimerOnRight = setTimeout(() => {
                holdTimerOnRight = setInterval(() => {
                    this.pressRight(game);
                }, 50);
            }, 250);
        });
        this.rightBtn.mouseReleased(() => {
            clearTimeout(delayTimerOnRight);
            clearTimeout(holdTimerOnRight);
        });

        let delayTimerOnLeft: NodeJS.Timeout;
        let holdTimerOnLeft: NodeJS.Timeout;
        this.leftBtn.mousePressed(() => {
            delayTimerOnLeft = setTimeout(() => {
                holdTimerOnLeft = setInterval(() => {
                    this.pressLeft(game);
                }, 50);
            }, 250);
        });
        this.leftBtn.mouseReleased(() => {
            clearTimeout(delayTimerOnLeft);
            clearTimeout(holdTimerOnLeft);
        });

        let delayTimerOnAction: NodeJS.Timeout;
        let holdTimerOnAction: NodeJS.Timeout;
        this.actionBtn.mousePressed(() => {
            delayTimerOnAction = setTimeout(() => {
                holdTimerOnAction = setInterval(() => {
                    this.pressAction(game);
                }, 50);
            }, 250);
        });
        this.actionBtn.mouseReleased(() => {
            clearTimeout(delayTimerOnAction);
            clearTimeout(holdTimerOnAction);
        });
    }

    unbound() {
        this.onOffBtn.mouseClicked(() => {});
        this.startPauseBtn.mouseClicked(() => {});
        this.soundBtn.mouseClicked(() => {});
        this.resetBtn.mouseClicked(() => {});
        this.exitBtn.mouseClicked(() => {});
        this.enableColorBtn.mouseClicked(() => {});

        this.upBtn.mouseClicked(() => {});
        this.downBtn.mouseClicked(() => {});
        this.rightBtn.mouseClicked(() => {});
        this.leftBtn.mouseClicked(() => {});

        this.actionBtn.mouseClicked(() => {});

        this.upBtn.mousePressed(() => {});
        this.upBtn.mouseReleased(() => {});

        this.downBtn.mousePressed(() => {});
        this.downBtn.mouseReleased(() => {});

        this.rightBtn.mousePressed(() => {});
        this.rightBtn.mouseReleased(() => {});

        this.leftBtn.mousePressed(() => {});
        this.leftBtn.mouseReleased(() => {});

        this.actionBtn.mousePressed(() => {});
        this.actionBtn.mouseReleased(() => {});
    }
}
