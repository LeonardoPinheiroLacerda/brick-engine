import P5 from 'p5';
import GameView from './view/GameView';

import './resources';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);

    p.setup = () => {
        view.build();
    };

    p.draw = () => {
        p.background(220);
    };
}, document.body);
