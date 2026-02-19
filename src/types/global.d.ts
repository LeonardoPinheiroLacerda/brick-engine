import Game from '../core/Game';
import p5 from 'p5';

declare global {
    interface Window {
        BrickEngineGame?: new (p: p5, view: GameView) => Game;
    }
}
