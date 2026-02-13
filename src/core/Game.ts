import P5 from 'p5';
import GameView from '../view/GameView';
import GameControl from './module/control/GameControl';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameState from './module/state/GameState';
import GameText from './module/text/GameText';
import { Initializable } from './types/Interfaces';
import { GameModules } from './types/Types';

export default abstract class Game implements Initializable {
    private _p: P5;

    private _modules: GameModules;
    private _view: GameView;

    constructor(p: P5, view: GameView) {
        this._p = p;
        this._view = view;
    }

    get modules(): GameModules {
        return this._modules;
    }

    setup() {
        this._view.build();

        this._modules = {
            renderer: new GameRenderer(this._p),
            grid: new GameGrid(),
            text: new GameText(this._p),
            state: new GameState(),
            control: new GameControl(),
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
        const { renderer, grid } = this._modules;
        renderer.render(grid.getGrid());
    }
}
