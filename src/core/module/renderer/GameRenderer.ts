import P5 from 'p5';
import DisplayRenderer from './DisplayRenderer';
import Cell from '../../interface/Cell';
import Renderer from './Renderer';

// Implementa o padrão Strategy Composite
export default class GameRenderer implements Renderer {
    private _renderers: Renderer[];

    constructor(p: P5) {
        this._renderers = [];
        this.addRenderer(new DisplayRenderer(p));
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
}
