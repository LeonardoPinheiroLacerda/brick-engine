import P5 from 'p5';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameTexts from './module/textWriter/GameTexts';

export default class Game {
    gameControls: any;
    p: P5;

    renderer: GameRenderer;
    grid: GameGrid;
    texts: GameTexts;

    constructor(p: P5) {
        this.p = p;
        this.renderer = new GameRenderer(p);
        this.grid = new GameGrid();
        this.texts = new GameTexts(p);
    }
}
