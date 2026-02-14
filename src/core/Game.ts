import P5 from 'p5';
import GameView from '../view/GameView';
import GameControl from './module/control/GameControl';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameState from './module/state/GameState';
import GameText from './module/text/GameText';
import GameTimeWithPerformanceMonitor from './module/time/GameTimeWithPerformanceMonitor';
import GameTime from './module/time/GameTime';
import GameSound from './module/sound/GameSound';
import GameScore from './module/score/GameScore';

import { Initializable, StateSyncable } from './types/Interfaces';
import { ControlEventType, ControlKey, GameModules } from './types/Types';
import configs from '../config/configs';

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

    protected _frameInterval: number;

    constructor(p: P5, view: GameView) {
        this._p = p;
        this._view = view;

        this._frameInterval = configs.game.frameInterval;
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
        const performanceMonitorEnabled = configs.game.performanceMonitor.enabled;

        this._view.build();

        this._modules = {
            renderer: new GameRenderer(this._p),
            grid: new GameGrid(),
            text: new GameText(this._p),
            state: new GameState(),
            control: new GameControl(),
            time: performanceMonitorEnabled ? new GameTimeWithPerformanceMonitor(configs.game.tickInterval) : new GameTime(configs.game.tickInterval),
            sound: new GameSound(),
            score: new GameScore(),
        };

        Object.values(this._modules).forEach(module => {
            if ('setup' in module) {
                module.setup();
            }
        });

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
        this._view.bound(control);
    }

    /**
     * Main draw loop, called by P5.js.
     * Handles time updates, logic ticks, and rendering.
     */
    draw() {
        const { renderer, grid, time } = this._modules;

        // Update time accumulator
        time.update(this._p.deltaTime);

        // Process Logic Tick
        if (time.shouldTick()) {
            this.processTick(this._p.deltaTime);
        }

        renderer.render(grid.getGrid());

        if (this._frameInterval === 0 || this._p.frameCount % this._frameInterval === 0) {
            this.processFrame();
        }

        // Performance Monitor Overlay
        time.renderPerformanceMonitor(this._p);
    }

    private _subscribeSystemControls(): void {
        const { control, state, grid } = this._modules;

        control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => state.toggleOn());
        control.subscribe(ControlKey.SOUND, ControlEventType.PRESSED, () => state.toggleMuted());
        control.subscribe(ControlKey.COLOR, ControlEventType.PRESSED, () => state.toggleColorEnabled());

        control.subscribe(ControlKey.RESET, ControlEventType.PRESSED, () => {
            grid.resetGrid();
            if (state.gameOver) {
                state.toggleGameOver();
            }
        });

        control.subscribe(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => {
            if (!state.start) {
                state.toggleStart();
            }
            state.toggleRunning();
        });

        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
            this._p.noLoop();
        });
    }

    /**
     * Abstract method for processing game logic.
     * Called every tick.
     * @param deltaTime Time elapsed since last tick.
     */
    abstract processTick(deltaTime: number): void;

    /**
     * Abstract method for processing visual frames.
     * Called every frame (depending on frameInterval).
     */
    abstract processFrame(): void;

    /**
     * Abstract method for setting up the game.
     * Called after the game modules are initialized.
     */
    abstract setupGame(): void;
}
