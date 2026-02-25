import p5 from 'p5';
import type GameView from '../view/GameView';
import GameControl from './module/control/GameControl';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameState from './module/state/GameState';
import GameText from './module/text/GameText';
import GameTime from './module/time/GameTime';
import GameSound from './module/sound/GameSound';
import GameScore from './module/score/GameScore';

import { Initializable } from './types/Interfaces';
import { ControlEventType, ControlKey, GameModules, StateProperty } from './types/Types';
import GameHudGrid from './module/grid/GameHudGrid';
import InterfaceIdentifierHelper from './helpers/InterfaceIdentifierHelper';
import InitialStateSnapshot from './InitialStateSnapshot';
import GameSession from './module/session/GameSession';

/**
 * Base abstract class for the game.
 *
 * It manages the game loop, initialization of core modules, and integration with p5.js.
 * All game logic should be implemented in subclasses by overriding `processTick` and `processFrame`.
 */
export default abstract class Game implements Initializable {
    protected _p: p5;
    protected _view: GameView;

    private _modules: GameModules = undefined as unknown as GameModules;

    private _initialStateSnapshot = new InitialStateSnapshot();

    private _gameId: string = 'unknown';

    /**
     * Gets the game ID
     */
    get gameId(): string {
        return this._gameId;
    }

    /**
     * Sets the game ID
     */
    set gameId(id: string) {
        this._gameId = id;
    }

    /**
     * Creates an instance of the Game.
     *
     * @param {p5} p - The p5 instance.
     * @param {GameView} view - The view strategy associated with this game.
     */
    constructor(p: p5, view: GameView) {
        this._p = p;
        this._view = view;
        this._initialStateSnapshot.captureBaseProperties(this);
    }

    /**
     * Gets the game view.
     *
     * @returns {GameView} The game view instance.
     */
    get view(): GameView {
        return this._view;
    }

    /**
     * Gets the game modules.
     *
     * @returns {GameModules} The collection of initialized game modules.
     */
    get modules(): GameModules {
        return this._modules;
    }

    /**
     * Sets up the game, initializing all modules and viewing components.
     * Called automatically by the engine key sequence.
     */
    setup() {
        this._view.build();

        this._modules = {
            renderer: new GameRenderer(this._p),
            grid: new GameGrid(),
            hudGrid: new GameHudGrid(),
            text: new GameText(this._p),
            state: new GameState(),
            control: new GameControl(),
            time: new GameTime(),
            sound: new GameSound(),
            score: new GameScore(),
            session: new GameSession(),
        };

        Object.values(this._modules).forEach(module => {
            if (InterfaceIdentifierHelper.isInitializable(module)) {
                module.setup();
            }
        });

        Object.values(this._modules).forEach(module => {
            if (InterfaceIdentifierHelper.isStateSyncable(module)) {
                module.syncState(this._modules.state);
            }
        });

        Object.values(this._modules).forEach(module => {
            if (InterfaceIdentifierHelper.isSerializable(module)) {
                this._modules.session.register(module);
            }
        });

        const { text, control, renderer, session } = this._modules;

        session.gameId = this.gameId;
        session.setShowModalFunction(this._view.showSessionModal.bind(this._view));

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        this.setupGame();
        this._initialStateSnapshot.captureInitialState(this);

        this._subscribeSystemControls();

        this._view.bindControls(control);
    }

    /**
     * Main draw loop, called by p5.js.
     * Handles time updates, logic ticks, and rendering.
     */
    draw() {
        if (!this._modules) return;

        const { renderer, grid, time, state } = this._modules;

        renderer.render(grid.getGrid(), this._modules);
        if (state.isOn()) {
            if (!state.isStarted()) {
                this.drawTitleScreen();
            } else if (state.isPlaying()) {
                time.update(this._p.deltaTime);
                // Update time accumulator

                // Process Logic Tick
                if (time.shouldTick()) {
                    this.update(this._p.deltaTime);

                    this._modules.session.saveSession();
                }

                this.render();
            } else if (state.isPaused()) {
                this.render();
            }

            if (state.isGameOver()) {
                this.drawGameOverScreen();
            }
        }
    }

    /**
     * Destroys the game instance, cleaning up all event listeners and stopping the loop.
     * Call this before switching to another game or when the game is no longer needed.
     */
    destroy() {
        this._p.noLoop();

        if (this._modules) {
            this._modules.control.unbindControls();
            this._modules.sound.stopAll();
        }
    }

    get p() {
        return this._p;
    }

    /**
     * Abstract method for processing game logic.
     * Called every tick, but ONLY when the game is in the 'playing' state.
     *
     * @param {number} deltaTime - Time elapsed since last tick.
     */
    abstract update(deltaTime: number): void;

    /**
     * Abstract method for processing visual frames.
     * Called every frame (depending on frameInterval).
     */
    abstract render(): void;

    /**
     * Abstract method for setting up the game specific logic.
     * Called after the game modules are initialized.
     */
    abstract setupGame(): void;

    /**
     * Abstract method for drawing the Title Screen (Welcome).
     * Called when the game is ON but not yet STARTED.
     */
    abstract drawTitleScreen(): void;

    /**
     * Abstract method for drawing the Game Over Screen.
     * Called when the game is in GAME OVER state.
     */
    abstract drawGameOverScreen(): void;

    private _subscribeSystemControls(): void {
        const { control, state, grid } = this._modules;

        control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => {
            if (state.isOn()) {
                state.turnOff();
                this.modules.sound.stopAll();
            } else {
                state.turnOn();
            }
        });
        control.subscribe(ControlKey.SOUND, ControlEventType.PRESSED, () => state.toggleMuted());
        control.subscribe(ControlKey.COLOR, ControlEventType.PRESSED, () => state.toggleColorEnabled());

        control.subscribe(ControlKey.RESET, ControlEventType.PRESSED, () => {
            grid.resetGrid();
            this.modules.score.resetScore();
            this.modules.score.resetLevel();
            this.modules.time.reset();
            this._modules.session.clearSession();
            state.resetGame();
            this._initialStateSnapshot.restoreInitialState(this);
        });

        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
            this._modules.session.clearSession();
        });

        control.subscribe(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => {
            if (!state.isStarted()) {
                state.startGame();
            } else if (state.isPlaying()) {
                state.pause();
            } else if (state.isPaused()) {
                state.resume();
            } else if (state.isGameOver()) {
                grid.resetGrid();
                this.modules.score.resetScore();
                this.modules.score.resetLevel();
                this.modules.time.reset();
                this.modules.session.clearSession();
                this._initialStateSnapshot.restoreInitialState(this);
                state.resetGameOver();
            }
        });

        state.subscribe(StateProperty.ON, isOn => {
            if (!isOn) {
                grid.resetGrid();
                this.modules.score.resetScore();
                this.modules.score.resetLevel();
                this.modules.time.reset();
            }
        });
    }
}
