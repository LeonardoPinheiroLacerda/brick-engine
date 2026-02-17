import P5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import configs from './config/configs';
import * as Enums from './core/types/enums';
import * as Interface from './core/types/Interfaces';
import * as Modules from './core/types/modules';
import * as Types from './core/types/Types';

import './config/resources';
import GameMenu from './menu/GameMenu';

export const P5Instance = new P5((p: P5) => {
    const view = new GameView(p, document.body);
    let activeGame: Game = new GameMenu(p, view);

    p.setup = () => {
        activeGame.setup();
    };

    p.draw = () => {
        activeGame.draw();
    };

    // Expose switching logic
    (window as any).BrickEngine = (window as any).BrickEngine || {};
    (window as any).BrickEngine.switchGame = (newGame: Game) => {
        activeGame = newGame;
        activeGame.setup();
    };
}, document.body);

export { Game, GameView, configs, Enums, Interface, Modules, Types };
