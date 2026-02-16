import P5 from 'p5';
import GameView from '../view/GameView';
import GameControl from './module/control/GameControl';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameState from './module/state/GameState';
import GameText from './module/text/GameText';
import GameTime from './module/time/GameTime';
import GameSound from './module/sound/GameSound';
import GameScore from './module/score/GameScore';

import { Initializable, StateSyncable } from './types/Interfaces';
import { ControlEventType, ControlKey, GameModules } from './types/Types';
import configs from '../config/configs';
import GameHudGrid from './module/grid/GameHudGrid';
import Debugger from './Debugger';

/**
 * Base abstract class for the game.
 *
 * It manages the game loop, initialization of core modules, and integration with P5.js.
 * All game logic should be implemented in subclasses by overriding `processTick` and `processFrame`.
 */
export default abstract class Game implements Initializable {
    private _p: P5;

    private _modules: GameModules;
    private _view: GameView;

    private _debugger: Debugger;

    constructor(p: P5, view: GameView) {
        this._p = p;
        this._view = view;
    }

    /**
     * Gets the game modules.
     * @returns {GameModules} The game modules.
     */
    get modules(): GameModules {
        return this._modules;
    }

    /**
     * Sets up the game, initializing all modules and viewing components.
     * Called automatically by the engine.
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
            if ('setup' in module) {
                module.setup();
            }
        });

        this._modules.state.setPersistenceKey(this.getPersistenceKey());

        Object.values(this._modules).forEach(module => {
            if ('syncState' in module && !(module instanceof GameState)) {
                (module as unknown as StateSyncable).syncState(this._modules.state);
            }
        });

        const { text, control, renderer } = this._modules;

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        this.setupGame();

        this._subscribeSystemControls();
        this._view.bindControls(control);

        this._debugger = new Debugger(this._modules);
        this._debugger.setup();
    }

    /**
     * Main draw loop, called by P5.js.
     * Handles time updates, logic ticks, and rendering.
     */
    draw() {
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
                }

                this.render();
            } else if (state.isPaused()) {
                this.render();
            }

            if (state.isGameOver()) {
                this.render();
                this.drawGameOverScreen();
            }
        }

        this._debugger.update();
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
            state.resetGame();
        });

        control.subscribe(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => {
            if (!state.isStarted()) {
                state.startGame();
            } else if (state.isPlaying()) {
                state.pause();
            } else {
                state.resume();
            }
        });

        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
            this._p.noLoop();
        });
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

        if (this._view) {
            this._view.unbindControls();
        }
    }

    get p() {
        return this._p;
    }

    /**
     * Abstract method for processing game logic.
     * Called every tick, but ONLY when the game is in the 'playing' state.
     * @param deltaTime Time elapsed since last tick.
     */
    abstract update(deltaTime: number): void;

    /**
     * Abstract method for processing visual frames.
     * Called every frame (depending on frameInterval).
     */
    abstract render(): void;

    /**
     * Abstract method for setting up the game.
     * Called after the game modules are initialized.
     */
    abstract setupGame(): void;

    /**
     * Abstract method for getting the persistence key.
     * Called after the game modules are initialized and sets itself in the state module.
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
}
