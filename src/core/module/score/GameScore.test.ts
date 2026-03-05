import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameScore from './GameScore';
import { ScoreProperty } from '../../types/enums';

describe('GameScore', () => {
    let gameScore: GameScore;

    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => {
                if (key === 'test-game::highScore') return '100';
                return null;
            }),
            setItem: vi.fn(),
        });

        gameScore = new GameScore();
        gameScore.setupGameHighScore('test-game');
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
            expect(localStorage.setItem).toHaveBeenCalledWith('test-game::highScore', '150');
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

    describe('Subscriptions', () => {
        it('should notify subscribers when score increases', () => {
            // [ARRANGE]
            const callback = vi.fn();
            gameScore.subscribe(ScoreProperty.SCORE, callback);

            // [ACT]
            gameScore.increaseScore(100);

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(100);
        });

        it('should notify subscribers when level changes', () => {
            // [ARRANGE]
            const callback = vi.fn();
            gameScore.subscribe(ScoreProperty.LEVEL, callback);

            // [ACT]
            gameScore.increaseLevel(1);

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(2);
        });

        it('should notify subscribers when multiplier changes', () => {
            // [ARRANGE]
            const callback = vi.fn();
            gameScore.subscribe(ScoreProperty.MULTIPLIER, callback);

            // [ACT]
            gameScore.multiplier = 3;

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(3);
        });

        it('should notify subscribers when high score is broken', () => {
            // [ARRANGE]
            const callback = vi.fn();
            gameScore.subscribe(ScoreProperty.HIGH_SCORE, callback);

            // [ACT]
            gameScore.increaseScore(200); // 200 > 100 (initial high score)

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(200);
        });

        it('should notify subscribers when max level changes', () => {
            // [ARRANGE]
            const callback = vi.fn();
            gameScore.subscribe(ScoreProperty.MAX_LEVEL, callback);

            // [ACT]
            gameScore.maxLevel = 50;

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(50);
        });
    });
});
