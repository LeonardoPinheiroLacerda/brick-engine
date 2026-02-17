import Game from '../core/Game';
import { GameEntry } from '../types/interfaces';

export default class GameRepository {
    private _games: GameEntry[] = [{ name: 'Tetris', url: 'http://127.0.0.1:8080/my-game.bundle.js' }, { name: 'Snake' }];

    get games(): GameEntry[] {
        return this._games;
    }

    registerGame(name: string, instance: Game) {
        // Check if game exists (by name) and update instance, or add new
        const existing = this._games.find(g => g.name === name);
        if (existing) {
            existing.instance = instance;
        } else {
            this._games.push({ name, instance });
        }
        console.log(`Game registered: ${name}`);
    }
}
