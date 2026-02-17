import Game from '../core/Game';
import GameView from '../view/GameView';
import P5 from 'p5';

declare global {
    interface Window {
        BrickEngine: {
            switchGame: (game: Game) => void;
        };
        BrickEngineGame?: new (p: P5, view: GameView) => Game;
    }
}
