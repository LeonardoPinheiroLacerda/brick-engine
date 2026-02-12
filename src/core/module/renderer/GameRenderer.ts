import P5 from 'p5';
import { Cell, DisplayMetrics } from '../../types/Types';
import { Renderer } from '../../types/Interfaces';
import DisplayRenderer from './DisplayRenderer';
import { RendererComposite } from '../../interface/modules';

// Implementa o padrão Strategy Composite
export default class GameRenderer implements RendererComposite {
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
            display: {
                width: this._displayRenderer.displayWidth,
                height: this._displayRenderer.displayHeight,
                origin: this._displayRenderer.displayOrigin,
            },
            hud: {
                width: null,
                height: null,
                origin: null,
            },
            cell: {
                size: this._displayRenderer.cellSize,
            },
        };
    }
}
