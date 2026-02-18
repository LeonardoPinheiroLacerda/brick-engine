import p5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import GameMenu from './menu/GameMenu';

import './config/styles';
import Debugger from './core/Debugger';

// @ts-expect-error - This alias is defined in webpack.config.js
import ClientGame from '@client-game';

const isClientMode = process.env.APP_MODE === 'client';

export const p5Instance = new p5((p: p5) => {
    const view = new GameView(p, document.body);
    let activeGame: Game;

    if (isClientMode) {
        // In client mode, we instantiate the game provided via alias
        activeGame = new ClientGame(p, view);
    } else {
        activeGame = new GameMenu(p, view);
    }

    let debuggerInstance: Debugger;

    // Register the switch handler
    Game.setSwitchHandler((newGame: Game) => {
        try {
            // Destroy the previous debugger instance
            if (debuggerInstance) {
                debuggerInstance.destroy();
            }

            // Unbind the previous game controls
            view.unbindControls();

            // Set the new game
            activeGame = newGame;
            activeGame.setup();

            // Bind the new game controls
            view.bindControls(activeGame.modules.control);
            activeGame.modules.state.turnOn();

            // Create the new debugger instance
            debuggerInstance = new Debugger(activeGame.modules);
            debuggerInstance.setup();
        } catch (error) {
            console.error('Error switching game:', error);
        }
        p.loop();
    });

    p.setup = () => {
        activeGame.setup();

        debuggerInstance = new Debugger(activeGame.modules);
        debuggerInstance.setup();
    };

    p.draw = () => {
        activeGame.draw();
        debuggerInstance.update();
    };
}, document.body);
