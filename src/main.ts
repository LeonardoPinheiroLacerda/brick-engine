import p5 from 'p5';
import Game from './core/Game';
import GameView from './view/GameView';
import GameMenu from './menu/GameMenu';
import './config/resources';

export const p5Instance = new p5((p: p5) => {
    const view = new GameView(p, document.body);
    let activeGame: Game = new GameMenu(p, view);

    // Register the switch handler
    Game.setSwitchHandler((newGame: Game) => {
        try {
            view.unbindControls();
            activeGame = newGame;
            activeGame.setup();
            view.bindControls(activeGame.modules.control);
            activeGame.modules.state.turnOn();
        } catch (error) {
            console.error('Error switching game:', error);
        }
        p.loop();
    });

    p.setup = () => {
        view.build();
        activeGame.setup();
    };

    p.draw = () => {
        activeGame.draw();
    };
}, document.body);
