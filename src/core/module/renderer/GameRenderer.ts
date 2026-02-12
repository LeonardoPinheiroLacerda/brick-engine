import P5 from 'p5';
import DisplayRenderer from './DisplayRenderer';
import Cell from '../../interface/Cell';
import Renderer from './Renderer';
import Coordinate from '../../interface/Coordinate';

export interface DisplayMetrics {
    displayWidth: number;
    displayHeight: number;
    displayOrigin: Coordinate;
    cellSize: number;
}

// Implementa o padrão Strategy Composite
export default class GameRenderer implements Renderer {
    private _renderers: Renderer[];

    private _displayRenderer: DisplayRenderer;

    constructor(p: P5) {
        this._displayRenderer = new DisplayRenderer(p);

        this._renderers = [];
        this.addRenderer(this._displayRenderer);
    }

    addRenderer(renderer: Renderer) {
        this._renderers.push(renderer);
    }

    setup() {
        this._renderers.forEach(renderer => renderer.setup());
    }

    render(grid: Cell[][]) {
        this._renderers.forEach(renderer => renderer.render(grid));
    }

    get displayMetrics(): DisplayMetrics {
        return {
            displayWidth: this._displayRenderer.displayWidth,
            displayHeight: this._displayRenderer.displayHeight,
            displayOrigin: this._displayRenderer.displayOrigin,
            cellSize: this._displayRenderer.cellSize,
        };
    }
}
