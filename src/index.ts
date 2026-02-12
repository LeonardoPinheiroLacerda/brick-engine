import P5 from 'p5';
import GameView from './view/GameView';

import './config/resources';
import Game from './core/Game';
import FontAlign from './core/enum/FontAlign';
import FontSize from './core/enum/FontSize';
import FontVerticalAlign from './core/enum/FontVerticalAlign';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);
    const { renderer, grid, text } = new Game(p);

    p.setup = () => {
        view.build();

        renderer.setup();

        text.defineFont();
        text.defineDisplayMetrics(renderer.displayMetrics);
    };

    p.draw = () => {
        renderer.render(grid.getGrid());

        text.setActiveText();
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.CENTER);
        text.setTextSize(FontSize.MEDIUM);
        text.textOnDisplay('Hello World', { x: 0.5, y: 0.5 });

        text.setInactiveText();
        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.TOP);
        text.setTextSize(FontSize.EXTRA_SMALL);
        text.textOnHud('Hello World', { x: 0, y: 0 });
    };
}, document.body);
