import { GameEntry } from '../types/interfaces';

export default class GameRepository {
    // prettier-ignore
    private _games: GameEntry[] = [
        {
            name: 'Tetris',
            url: 'http://localhost:8080/game.bundle.js'
        }, {
            name: 'Snake',
            url: 'http://localhost:8080/snake.bundle.js'
        }
    ];

    get games(): readonly GameEntry[] {
        return Object.freeze(this._games);
    }
}
