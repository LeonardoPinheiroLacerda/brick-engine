import p5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import GameMenu from './menu/GameMenu';

import './config/styles';
import Debugger from './core/Debugger';

import { isClientMode, isServerMode } from './config/env';
import ClientGame from '@client-game';
import { ControlEventType, ControlKey } from './core/types/enums';
import GameMenuSingleton from './menu/GameMenuSingleton';

export const p5Instance = new p5((p: p5) => {
    const view = new GameView(p, document.body);
    let activeGame: Game;

    if (isClientMode()) {
        // In client mode, we instantiate the game provided via alias
        activeGame = new ClientGame(p, view);
    } else if (isServerMode()) {
        // In server mode, we instantiate the game menu
        activeGame = new GameMenu(p, view);
        GameMenuSingleton.setInstance(activeGame as GameMenu);
    } else {
        throw new Error('Invalid APP_MODE');
    }

    let debuggerInstance: Debugger;

    // Register the switch handler
    activeGame.setSwitchHandler((newGame: Game) => {
        try {
            // Destroy the previous debugger instance
            if (debuggerInstance) {
                debuggerInstance.destroy();
            }

            // Unbind the previous game controls
            activeGame.view.unbindControls();

            // Propagate the switch handler to the new game
            newGame.propagateSwitchHandler(activeGame);

            // Set the new game
            activeGame = newGame;
            activeGame.setup();
            // Bind the new game controls
            activeGame.view.bindControls(activeGame.modules.control);
            activeGame.modules.state.turnOn();

            // Create the new debugger instance
            debuggerInstance = new Debugger(activeGame.modules);
            debuggerInstance.setup();

            if (isServerMode() && newGame !== GameMenuSingleton.getInstance()) {
                newGame.modules.control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
                    newGame.switchGame(GameMenuSingleton.getInstance());
                });

                newGame.modules.control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => {
                    newGame.switchGame(GameMenuSingleton.getInstance());
                    activeGame.modules.state.turnOff();
                });
            }
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
