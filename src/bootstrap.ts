import p5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import RendererContext from './core/context/RendererContext';

/**
 * Defines the strict constructor signature for Client games booting via the Engine.
 *
 * @callback ClientGameConstructor
 * @param {p5} p - The core rendering context pointer injected at runtime.
 * @param {GameView} view - The specifically built UI configuration context.
 * @returns {Game} A newly instantiated concrete subclass encompassing all module logic.
 */
type ClientGameConstructor = new (view: GameView) => Game;

let _game: Game;

/**
 * Hotswaps the persistent engine tracking pointer dictating logic execution loops.
 *
 * @param {Game} game - The fully instantiated class implementing custom module rules.
 * @returns {void} Returns nothing.
 */
export function setActiveGame(game: Game): void {
    _game = game;
}

/**
 * Orchestrating structural point of initialization isolating strict client code execution.
 *
 * Acts as the absolute architectural start for the engine lifecycle. It isolates complex P5.js
 * canvas injection, internal context caching, and DOM viewport creation away from actual Game logic.
 *
 * @param {ClientGameConstructor} ClientGame - The non-instantiated class definition targeted.
 * @returns {p5} The successfully built processing sketch mapping logic safely onto the web document.
 */
export function bootstrap(ClientGame: ClientGameConstructor): p5 {
    window.BrickEngineGame = ClientGame;

    return new p5((p: p5) => {
        RendererContext.init(p);

        const view = new GameView(document.body);

        setActiveGame(new ClientGame(view));
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
