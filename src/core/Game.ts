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
import configs from '../config/configs';
import GameHudGrid from './module/grid/GameHudGrid';
import InterfaceIdentifierHelper from './helpers/InterfaceIdentifierHelper';
import { Serializable, SessionManager } from '../types/interfaces';
import LocalStorageSessionManager from './session/LocalStorageSessionManager';

/**
 * Base abstract class for the game.
 *
 * It manages the game loop, initialization of core modules, and integration with p5.js.
 * All game logic should be implemented in subclasses by overriding `processTick` and `processFrame`.
 */
export default abstract class Game implements Initializable {
    protected _p: p5;
    protected _view: GameView;

    protected _modules: GameModules;

    protected _sessionManager: SessionManager;
    protected _serializables: Serializable[] = [];

    private _switchHandler: (newGame: Game) => void;

    /**
     * Registers the callback to be used when a game requests to switch to another game.
     * This is typically called by the engine's main loop (index.ts).
     * @param handler The callback function.
     */
    setSwitchHandler(handler: (newGame: Game) => void) {
        this._switchHandler = handler;
    }

    /**
     * Propagates the switch handler to the new game.
     * @param game Game instance that has the switch handler.
     */
    propagateSwitchHandler(game: Game) {
        this.setSwitchHandler(game._switchHandler);
    }

    /**
     * Registers a custom object or module for session persistence.
     * Custom serializables allow games to save specific properties in the browser session.
     * These properties are restored automatically alongside engine modules when resuming a `PLAYING` state.
     *
     * @param {Serializable} serializable - The custom object to be saved.
     */
    addSerializable(serializable: Serializable) {
        this._serializables.push(serializable);
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
     * Switches execution to a new game instance.
     * Use this instead of global window methods.
     *
     * @param {Game} newGame - The new game instance to load.
     */
    switchGame(newGame: Game): void {
        this.destroy(); // Clean up current game
        if (this._switchHandler) {
            this._switchHandler(newGame);
        } else {
            console.error('Game switch handler not registered. Cannot switch game.');
        }
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
            time: new GameTime(configs.game.tickInterval),
            sound: new GameSound(),
            score: new GameScore(),
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

        const { text, control, renderer } = this._modules;

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        this.setupGame();

        this._subscribeSystemControls();
        this._subscribeSystemStates();

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

                    // Save session
                    this._serializables.forEach(serializable => {
                        this._sessionManager.saveSession(serializable, this.getPersistenceKey());
                    });
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
     * Abstract method for getting the persistence key.
     * Called after the game modules are initialized and sets itself in the state module.
     *
     * @returns {string} The persistence key.
     */
    abstract getPersistenceKey(): string;

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

    private _subscribeSystemStates() {
        const { state } = this._modules;

        state.subscribe(StateProperty.GAME_OVER, (gameOver: boolean) => {
            if (gameOver) {
                this._serializables.forEach(serializable => {
                    this._sessionManager.clearSession(serializable, this.getPersistenceKey());
                });
            }
        });

        state.subscribe(StateProperty.PLAYING, (playing: boolean) => {
            if (playing) {
                const activeSessions: Serializable[] = [];

                // Check for custom serializables
                this._serializables.forEach(serializable => {
                    if (this._sessionManager.hasSession(serializable, this.getPersistenceKey())) {
                        activeSessions.push(serializable);
                    }
                });

                // Check for modules serializables
                this._sessionManager = new LocalStorageSessionManager();
                Object.values(this._modules).forEach(module => {
                    if (InterfaceIdentifierHelper.isSerializable(module)) {
                        this._serializables.push(module);
                        if (this._sessionManager.hasSession(module, this.getPersistenceKey())) {
                            activeSessions.push(module);
                        }
                    }
                });

                // If there are active sessions, show the modal
                if (activeSessions.length > 0 && !this._amIGameMenu()) {
                    this._view.showSessionModal(
                        () => {
                            console.log('Confirm');
                        },
                        () => {
                            console.log('Cancel');
                        },
                    );
                }
            }
        });
    }

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
            this._clearSession();
            state.resetGame();
        });

        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
            this._clearSession();
        });

        control.subscribe(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => {
            if (!state.isStarted()) {
                state.startGame();
            } else if (state.isPlaying()) {
                state.pause();
            } else if (state.isPaused()) {
                state.resume();
            } else if (state.isGameOver()) {
                state.resetGameOver();
                this._clearSession();
            }
        });
    }
    private _clearSession(): void {
        this._serializables.forEach(serializable => {
            this._sessionManager.clearSession(serializable, this.getPersistenceKey());
        });
    }

    private _amIGameMenu(): boolean {
        return this.constructor.name === 'GameMenu';
    }
}
