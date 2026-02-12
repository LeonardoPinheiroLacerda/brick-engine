import P5 from 'p5';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameText from './module/text/GameText';
import { FontSize, FontAlign, FontVerticalAlign } from './types/enums';
import { Initializable } from './types/Interfaces';
import { DisplayMetrics } from './types/Types';
import { Grid, RendererComposite, Text } from './interface/modules';

export default class Game implements Initializable {
    gameControls: any;
    private _p: P5;

    private _renderer: RendererComposite;
    private _grid: Grid;
    private _text: Text;

    private _displayMetrics: DisplayMetrics;

    constructor(p: P5) {
        this._p = p;
    }

    private _createModules() {
        this._renderer = new GameRenderer(this._p);
        this._grid = new GameGrid();
        this._text = new GameText(this._p);
    }

    setup() {
        this._createModules();

        this._grid.setup();
        this._renderer.setup();
        this._text.setup();

        this._displayMetrics = this._renderer.displayMetrics;
        this._text.setDisplayMetrics(this._displayMetrics);
    }

    draw() {
        this._renderer.render(this._grid.getGrid());

        this._text.setActiveText();
        this._text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.CENTER);
        this._text.setTextSize(FontSize.MEDIUM);
        this._text.textOnDisplay('Hello World', { x: 0.5, y: 0.5 });

        this._text.setInactiveText();
        this._text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.TOP);
        this._text.setTextSize(FontSize.EXTRA_SMALL);
        this._text.textOnHud('Hello World', { x: 0, y: 0 });
    }
}
