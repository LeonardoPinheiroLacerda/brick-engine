import P5 from 'p5';
import DisplayRenderer from './DisplayRenderer';
import Cell from '../../interface/Cell';
import Renderer from './Renderer';

export default class GameRenderer implements Renderer {
    private _renderers: Renderer[];

    constructor(p: P5) {
        this._renderers = [new DisplayRenderer(p)];
    }

    setup() {
        this._renderers.forEach(renderer => renderer.setup());
    }

    render(grid: Cell[][]) {
        this._renderers.forEach(renderer => renderer.render(grid));
    }
}
