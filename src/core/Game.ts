import P5 from 'p5';
import GameRenderer from './module/renderer/GameRenderer';
import GameGrid from './module/grid/GameGrid';

export default class Game {
    gameControls: any;
    p: P5;

    renderer: GameRenderer;
    grid: GameGrid;

    constructor(p: P5) {
        this.p = p;
        this.renderer = new GameRenderer(p);
        this.grid = new GameGrid();
    }
}
