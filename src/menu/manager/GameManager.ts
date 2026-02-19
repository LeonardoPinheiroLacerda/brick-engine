import Game from '../../core/Game';
import { GameEntry } from '../../types/interfaces';

export default class GameManager {
    public async handleGameSwitch(entry: GameEntry, actualGame: Game) {
        try {
            await this._loadGameScript(entry.url);

            // Client must define window.BrickEngineGame
            console.log('Game instance defined on window.BrickEngineGame by client project: ', window.BrickEngineGame);

            if (window.BrickEngineGame) {
                const gameInstance = new window.BrickEngineGame(actualGame.p, actualGame.view);
                console.log('Game loaded: ', entry.name);

                console.log('Switching to game');
                actualGame.switchGame(gameInstance);

                console.log('Game switched');
                // Cleanup
                console.log('Cleaning up window.BrickEngineGame');
                delete window.BrickEngineGame;
            } else {
                console.error('Game bundle loaded but window.BrickEngineGame was not set.');
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
    }

    private _loadGameScript(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById('game-client-script');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = url;
            script.id = 'game-client-script';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script ${url}`));
            document.head.appendChild(script);
        });
    }
}
