import Game from '../../core/Game';
import { GameEntry } from '../../types/interfaces';
import GameRepository from '../GameRepository';

export default class GameManager {
    private _gameRepository: GameRepository;

    constructor(gameRepository: GameRepository) {
        this._gameRepository = gameRepository;
    }

    public async handleGameSelection(entry: GameEntry, actualGame: Game) {
        if (entry.instance) {
            console.log('Switching to cached game:', entry.name);
            actualGame.switchGame(entry.instance);
        } else if (entry.url) {
            try {
                await this._loadGameScript(entry.url);
                if (window.BrickEngineGame) {
                    const gameInstance = new window.BrickEngineGame(actualGame.p, actualGame.view);
                    this._gameRepository.registerGame(entry.name, gameInstance);
                    console.log('Game loaded and registered:', entry.name);
                    actualGame.switchGame(gameInstance);
                    // Cleanup
                    delete window.BrickEngineGame;
                } else {
                    console.error('Game bundle loaded but window.BrickEngineGame was not set.');
                }
            } catch (e) {
                console.error('Failed to load game:', e);
            }
        }
    }

    private _loadGameScript(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script ${url}`));
            document.head.appendChild(script);
        });
    }
}
