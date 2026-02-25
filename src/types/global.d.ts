import Game from '../core/Game';

declare global {
    interface Window {
        BrickEngineGame?: new (view: GameView) => Game;
    }
}
