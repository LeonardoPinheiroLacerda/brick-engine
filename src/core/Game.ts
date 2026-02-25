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
import { GameModules } from './types/Types';
import GameHudGrid from './module/grid/GameHudGrid';
import InterfaceIdentifierHelper from './helpers/InterfaceIdentifierHelper';
import InitialStateSnapshot from './InitialStateSnapshot';
import GameSession from './module/session/GameSession';
import p5 from 'p5';
import RendererContext from './context/RendererContext';
import GameEventRegistry from './event/GameEventRegistry';

/**
 * Base abstract class for the game.
 *
 * It manages the game loop, initialization of core modules, and integration with p5.js.
 * All game logic should be implemented in subclasses by overriding `processTick` and `processFrame`.
 */
export default abstract class Game implements Initializable {
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
    constructor(view: GameView) {
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
     * Gets the p5 instance.
     *
     * @returns {p5} The p5 instance.
     */
    get p(): p5 {
        return RendererContext.p;
    }

    /**
     * Sets up the game, initializing all modules and viewing components.
     * Called automatically by the engine key sequence.
     *
     * Internally calls `setupGame()` and then `captureInitialState()`.
     * This means that all subclass properties (including those initialized in `setupGame`)
     * are captured as the initial state for the resetting mechanism.
     */
    setup() {
        this._view.build();

        this._modules = {
            renderer: new GameRenderer(),
            grid: new GameGrid(),
            hudGrid: new GameHudGrid(),
            text: new GameText(),
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

        const { text, control, renderer, session, score } = this._modules;

        session.gameId = this.gameId;
        session.setShowModalFunction(this._view.showSessionModal.bind(this._view));
        session.setResetFunction(this.reset.bind(this));

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        score.setupGameHighScore(this.gameId);

        this.setupGame();

        GameEventRegistry.setupControlEvents(this._modules, this.reset.bind(this));
        GameEventRegistry.setupStateEvents(this._modules);

        this._view.bindControls(control);

        this._modules.time.captureInitialState();

        this._initialStateSnapshot.captureInitialState(this);
    }

    /**
     * Main draw loop, called by p5.js.
     * Handles time updates, logic ticks, and rendering.
     */
    draw() {
        const { p } = RendererContext;

        if (!this._modules) return;

        const { renderer, grid, time, state, session } = this._modules;

        if (session.isModalOpen() || (state.isPlaying() && !session.isSessionResolved())) return;

        renderer.render(grid.getGrid(), this._modules);
        if (state.isOn()) {
            if (!state.isStarted()) {
                this.drawTitleScreen();
            } else if (state.isPlaying()) {
                time.update(p.deltaTime);
                // Update time accumulator

                // Process Logic Tick
                if (time.shouldTick()) {
                    this.update(p.deltaTime);

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
        RendererContext.p.noLoop();

        if (this._modules) {
            this._modules.control.unbindControls();
            this._modules.sound.stopAll();
        }
    }

    /**
     * Resets the game to its initial state.
     * This method is called by the reset event handler and should be used to restore the game to its initial state.
     */
    reset() {
        this._modules.grid.resetGrid();
        this._modules.score.resetScore();
        this._modules.score.resetLevel();
        this._modules.time.reset();
        this._modules.session.clearSession();
        this._initialStateSnapshot.restoreInitialState(this);
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
     *
     * Note: All initial properties should be fully assigned here,
     * as `captureInitialState()` is invoked immediately after this method,
     * taking a snapshot for the reset mechanism.
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
}
