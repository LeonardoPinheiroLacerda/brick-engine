import Game from '../core/Game';

export interface GameEntry {
    name: string;
    url?: string;
    instance?: Game;
}

class GameRepository {
    private _games: GameEntry[] = [{ name: 'Tetris' }, { name: 'Snake' }];

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

export const repository = new GameRepository();
export const games = repository.games; // Legacy compatibility, or access via repository
