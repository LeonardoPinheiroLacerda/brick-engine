import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameScore from './GameScore';

describe('GameScore', () => {
    let gameScore: GameScore;

    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue('100'),
            setItem: vi.fn(),
        });

        gameScore = new GameScore();
        gameScore.setup();
    });

    describe('increaseScore', () => {
        it('should increase score by base amount * multiplier', () => {
            // [ARRANGE]
            gameScore.multiplier = 2;

            // [ACT]
            gameScore.increaseScore(50);

            // [ASSERT]
            expect(gameScore.score).toBe(100);
        });

        it('should update high score if current score exceeds it', () => {
            // [ACT]
            gameScore.increaseScore(150);

            // [ASSERT]
            expect(localStorage.setItem).toHaveBeenCalledWith('highScore', '150');
            expect(gameScore.highScore).toBe(150);
        });

        it('should NOT update high score if current score is lower than high score', () => {
            // [ACT]
            gameScore.increaseScore(50);

            // [ASSERT]
            expect(localStorage.setItem).not.toHaveBeenCalled();
            expect(gameScore.highScore).toBe(100);
        });
    });

    describe('formatting', () => {
        it('should return score padded with zeros', () => {
            // [ARRANGE]
            gameScore.increaseScore(123); // multiplier is 1 by default

            // [ACT]
            const formatted = gameScore.getFormattedScore(6);

            // [ASSERT]
            expect(formatted).toBe('000123');
        });
    });

    describe('Level Management', () => {
        it('should increase and reset level', () => {
            // [ACT]
            gameScore.increaseLevel(2);
            expect(gameScore.level).toBe(3);

            gameScore.resetLevel();
            expect(gameScore.level).toBe(1);
        });
    });
});
