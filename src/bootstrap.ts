import p5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import RendererContext from './core/context/RendererContext';

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

/**
 * Updates the currently active game in the engine's execution loop.
 *
 * @param {Game} game - The new game instance to become active.
 */
export function setActiveGame(game: Game) {
    _game = game;
}

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
    window.BrickEngineGame = ClientGame;

    return new p5((p: p5) => {
        RendererContext.init(p);

        const view = new GameView(p, document.body);

        setActiveGame(new ClientGame(p, view));
        if (_game.gameId === 'unknown') {
            _game.gameId = 'game';
        }

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
