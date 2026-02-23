import { GameEntry } from '../types/interfaces';

export default class GameRepository {
    private _games: GameEntry[] = [{ id: 'loading', name: 'Loading...', url: '' }];

    constructor() {
        this.fetchGames();
    }

    private async fetchGames(): Promise<void> {
        try {
            // Read from injected env variables, or fallback to local
            const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
            const anonKey = process.env.SUPABASE_ANON_KEY || '';

            const headers: HeadersInit = {};
            if (anonKey) {
                headers['Authorization'] = `Bearer ${anonKey}`;
            }

            const response = await fetch(`${supabaseUrl}/functions/v1/list`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(`Error fetching games: ${response.statusText}`);
            }
            const data = await response.json();
            if (data && data.games && data.games.length > 0) {
                this._games = data.games.map((game: GameEntry) => ({
                    id: game.id,
                    name: game.name,
                    url: game.url,
                }));
            } else {
                this._games = [{ id: 'empty', name: 'Not found', url: '' }];
            }
        } catch (error) {
            console.error(error);
            this._games = [{ id: 'error', name: 'Error', url: '' }];
        }
    }

    get games(): readonly GameEntry[] {
        return Object.freeze(this._games);
    }
}
