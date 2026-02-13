import P5 from 'p5';
import GameView from '../view/GameView';
import GameControl from './module/control/GameControl';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameState from './module/state/GameState';
import GameText from './module/text/GameText';
import GameTimeWithPerformance from './module/time/GameTimeWithPerformance';
import GameTime from './module/time/GameTime';

import { Initializable } from './types/Interfaces';
import { GameModules } from './types/Types';
import configs from '../config/configs';

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

    get modules(): GameModules {
        return this._modules;
    }

    setup() {
        const performanceMonitorEnabled = configs.game.performance.enabled;

        this._view.build();

        this._modules = {
            renderer: new GameRenderer(this._p),
            grid: new GameGrid(),
            text: new GameText(this._p),
            state: new GameState(),
            control: new GameControl(),
            time: performanceMonitorEnabled ? new GameTimeWithPerformance(configs.game.tickInterval) : new GameTime(configs.game.tickInterval),
        };

        Object.values(this._modules).forEach(module => {
            (module as Initializable).setup();
        });

        const { text, control, renderer } = this._modules;

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        this._view.bound(control);
    }

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

        // Performance Overlay
        time.renderPerformance(this._p);
    }

    abstract processTick(deltaTime: number): void;
    abstract processFrame(): void;
}
