import p5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import GameMenu from './menu/GameMenu';

import './config/styles';

import { ControlEventType, ControlKey } from './core/types/enums';
import GameMenuSingleton from './menu/GameMenuSingleton';

/**
 * Represents a constructor for a game class.
 *
 * @callback ClientGameConstructor
 * @param {p5} p - The p5 instance.
 * @param {GameView} view - The game view instance.
 * @returns {Game} A new game instance.
 */
type ClientGameConstructor = new (p: p5, view: GameView) => Game;

let _game: Game;
let _p: p5;
/**
 * Handles the logic for switching between different games.
 *
 * This handler unbinds controls from the current game, sets up the new game,
 * propagates shared state, and rebinds controls to the new game's controller.
 *
 * @param {Game} newGame - The new game instance to switch to.
 * @returns {void}
 */
const _switchHandler = (newGame: Game) => {
    try {
        // Unbind the previous game controls
        _game.view.unbindControls();

        // Propagate the switch handler to the new game
        newGame.propagateSwitchHandler(_game);

        // Set the new game
        newGame.setup();

        const { control, state } = newGame.modules;

        // Update debugger
        newGame.view.updateDebuggerGameModules(newGame.modules);

        // Bind the new game controls
        newGame.view.bindControls(control);
        state.turnOn();

        // Setup exit and power buttons
        if (GameMenuSingleton.hasInstance() && newGame !== GameMenuSingleton.getInstance()) {
            control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
                newGame.switchGame(GameMenuSingleton.getInstance());
            });

            control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => {
                newGame.switchGame(GameMenuSingleton.getInstance());
                state.turnOff();
            });
        }
        _game = newGame;
    } catch (error) {
        console.error('Error switching game:', error);
    }
    _p.loop();
};

/**
 * Bootstraps the brick engine and initializes the game.
 *
 * This is the main entry point for the engine's execution. It creates a new p5 instance,
 * initializes the view, and sets up the initial game provided by the caller.
 *
 * @param {ClientGameConstructor} ClientGame - The constructor of the game to be loaded.
 * @returns {p5} The p5 instance.
 */
export function bootstrap(ClientGame: ClientGameConstructor) {
    return new p5((p: p5) => {
        _p = p;

        const view = new GameView(p, document.body);

        if (ClientGame === GameMenu) {
            _game = new ClientGame(p, view);
            GameMenuSingleton.setInstance(_game as GameMenu);
        } else {
            _game = new ClientGame(p, view);
        }

        _game.setSwitchHandler(_switchHandler);

        p.setup = () => {
            _game.setup();
            _game.view.setupDebugger(_game.modules);
            _game.view.setupSessionModal();
        };

        p.draw = () => {
            _game.draw();
            _game.view.updateDebugger();
        };
    });
}
