import P5 from 'p5';
import GameView from './view/GameView';

import './config/resources';
import Game from './core/Game';
import Color from './core/enum/Color';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);
    const { renderer, grid } = new Game(p);

    p.setup = () => {
        view.build();
        renderer.setup();
    };

    p.draw = () => {
        renderer.render(grid.grid);
    };
}, document.body);
