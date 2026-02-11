import P5 from 'p5';
import GameRenderer from './module/renderer/GameRenderer';

export default class Game {
    gameControls: any;
    p: P5;

    renderer: GameRenderer;

    constructor(p: P5) {
        this.p = p;
        this.renderer = new GameRenderer(p);
    }
}
