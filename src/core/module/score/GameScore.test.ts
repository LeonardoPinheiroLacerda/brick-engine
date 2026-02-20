import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameScore from './GameScore';
import { State } from '../../types/modules';

describe('GameScore', () => {
    let gameScore: GameScore;
    let mockState: State;

    beforeEach(() => {
        mockState = {
            getHighScore: vi.fn().mockReturnValue(100),
            setHighScore: vi.fn(),
        } as unknown as State;

        gameScore = new GameScore();
        gameScore.syncState(mockState);
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
            expect(mockState.setHighScore).toHaveBeenCalledWith(150);
        });

        it('should NOT update high score if current score is lower than high score', () => {
            // [ACT]
            gameScore.increaseScore(50);

            // [ASSERT]
            expect(mockState.setHighScore).not.toHaveBeenCalled();
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
