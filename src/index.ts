import P5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';

import './config/resources';
import GameMenu from './menu/GameMenu';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);
    let activeGame: Game = new GameMenu(p, view);

    // Register the switch handler
    Game.setSwitchHandler((newGame: Game) => {
        activeGame = newGame;
        activeGame.setup();
        p.loop();
    });

    p.setup = () => {
        activeGame.setup();
    };

    p.draw = () => {
        activeGame.draw();
    };
}, document.body);

export * from './core/types/enums';
export * from './core/types/Interfaces';
export * from './core/types/modules';
export * from './core/types/Types';
export { default as Game } from './core/Game';
export { default as GameView } from './view/GameView';
export { default as configs } from './config/configs';
