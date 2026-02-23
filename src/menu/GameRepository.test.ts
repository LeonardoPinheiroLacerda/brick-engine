import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GameRepository from './GameRepository';

describe('GameRepository', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({
                    games: [{ id: 'test-game', name: 'Test Game', url: 'http://localhost:8080/game.bundle.js' }],
                }),
            }),
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should start with a loading state', () => {
        const repo = new GameRepository();
        expect(repo.games).toBeDefined();
        expect(repo.games.length).toBeGreaterThan(0);
        expect(repo.games[0].name).toBe('Loading...');
        expect(repo.games[0].id).toBe('loading');
    });

    it('should load games asynchronously', async () => {
        const repo = new GameRepository();
        // Wait for the microtask queue to process the fetch
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(repo.games[0].id).toBe('test-game');
        expect(repo.games[0].name).toBe('Test Game');
        expect(repo.games[0].url).toBe('http://localhost:8080/game.bundle.js');
    });

    it('should return a frozen list of games', () => {
        const repo = new GameRepository();
        const games = repo.games;

        // This should throw in strict mode, or at least not change if we tried to mutate it
        expect(Object.isFrozen(games)).toBe(true);
    });
});
