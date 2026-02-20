import { describe, it, expect } from 'vitest';
import GameRepository from './GameRepository';

describe('GameRepository', () => {
    it('should return a list of games', () => {
        const repo = new GameRepository();
        expect(repo.games).toBeDefined();
        expect(repo.games.length).toBeGreaterThan(0);
        expect(repo.games[0].name).toBe('Tetris');
    });

    it('should return a frozen list of games', () => {
        const repo = new GameRepository();
        const games = repo.games;

        // This should throw in strict mode, or at least not change if we tried to mutate it
        expect(Object.isFrozen(games)).toBe(true);
    });
});
