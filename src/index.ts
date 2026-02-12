import P5 from 'p5';
import GameView from './view/GameView';

import './config/resources';
import Game from './core/Game';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);
    const game = new Game(p);

    p.setup = () => {
        view.build();
        game.setup();
    };

    p.draw = () => {
        game.draw();
    };
}, document.body);
