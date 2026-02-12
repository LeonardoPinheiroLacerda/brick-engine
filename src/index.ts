import P5 from 'p5';
import GameView from './view/GameView';

import './config/resources';
import Game from './core/Game';
import FontAlign from './core/enum/FontAlign';
import FontSize from './core/enum/FontSize';
import FontVerticalAlign from './core/enum/FontVerticalAlign';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);
    const { renderer, grid, texts } = new Game(p);

    p.setup = () => {
        view.build();

        renderer.setup();

        texts.defineFont();
        texts.defineDisplayMetrics(renderer.displayMetrics);
    };

    p.draw = () => {
        renderer.render(grid.getGrid());

        texts.setActiveText();
        texts.setTextAlign(FontAlign.CENTER, FontVerticalAlign.CENTER);
        texts.setTextSize(FontSize.MEDIUM);
        texts.textOnDisplay('Hello World', { x: 0.5, y: 0.5 });

        texts.setInactiveText();
        texts.setTextAlign(FontAlign.LEFT, FontVerticalAlign.TOP);
        texts.setTextSize(FontSize.EXTRA_SMALL);
        texts.textOnHud('Hello World', { x: 0, y: 0 });
    };
}, document.body);
