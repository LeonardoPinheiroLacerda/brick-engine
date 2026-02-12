import P5 from 'p5';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameText from './module/text/GameText';
import GameState from './module/state/GameState';
import GameControl from './module/control/GameControl';
import { FontSize, FontAlign, FontVerticalAlign, ControlKey } from './types/enums';
import { Initializable } from './types/Interfaces';
import { RendererMetrics, GameModules } from './types/Types';
import { Grid, RendererComposite, Text, State, Control } from './types/modules';
import GameView from '../view/GameView';

export default class Game implements Initializable {
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

        this._modules.renderer.setup();
        this._modules.grid.setup();
        this._modules.text.setup();
        this._modules.state.setup();
        this._modules.control.setup();

        const { grid, text, state, control, renderer } = this._modules;

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        this._view.bound(control);
    }

    draw() {
        const { text, renderer, grid } = this._modules;

        renderer.render(grid.getGrid());

        text.setActiveText();
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.CENTER);
        text.setTextSize(FontSize.MEDIUM);
        text.textOnDisplay('Hello World', { x: 0.5, y: 0.5 });

        text.setInactiveText();
        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.TOP);
        text.setTextSize(FontSize.EXTRA_SMALL);
        text.textOnHud('Hello World', { x: 0, y: 0 });
    }
}
