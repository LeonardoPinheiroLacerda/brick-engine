import { describe, it, expect, beforeEach } from 'vitest';
import GameTime from './GameTime';

describe('GameTime', () => {
    let gameTime: GameTime;
    const INTERVAL = 100;

    beforeEach(() => {
        gameTime = new GameTime(INTERVAL);
        gameTime.setup();
    });

    describe('update & shouldTick', () => {
        it('should accumulate time and trigger tick when interval is reached', () => {
            // [ACT]
            gameTime.update(50);
            const firstCheck = gameTime.shouldTick();

            gameTime.update(50);
            const secondCheck = gameTime.shouldTick();

            // [ASSERT]
            expect(firstCheck).toBe(false);
            expect(secondCheck).toBe(true);
        });

        it('should handle multiple ticks in one large update', () => {
            // [ACT]
            gameTime.update(250);

            const tick1 = gameTime.shouldTick(); // consumes 100, rem 150
            const tick2 = gameTime.shouldTick(); // consumes 100, rem 50
            const tick3 = gameTime.shouldTick();

            // [ASSERT]
            expect(tick1).toBe(true);
            expect(tick2).toBe(true);
            expect(tick3).toBe(false);
        });
    });

    describe('FPS & TPS calculation', () => {
        it('should calculate FPS correctly', () => {
            // [ACT]
            gameTime.update(16.666); // roughly 60fps

            // [ASSERT]
            const debug = gameTime.getDebugData();
            expect(debug.fps).toBe(60);
        });

        it('should update TPS every 1000ms', () => {
            // [ARRANGE] Trigger 5 ticks
            for (let i = 0; i < 5; i++) {
                gameTime.update(INTERVAL);
                gameTime.shouldTick();
            }

            // [ACT]
            gameTime.update(500); // 5*100 + 500 = 1000ms elapsed

            // [ASSERT]
            const debug = gameTime.getDebugData();
            expect(debug.tps).toBe(5);
        });
    });

    describe('Interval management', () => {
        it('should decrement interval but stay above minimum', () => {
            // [ACT]
            gameTime.decrementTickInterval(200);

            // [ASSERT]
            expect(gameTime.tickInterval).toBe(10);
        });

        it('should increment interval', () => {
            // [ACT]
            gameTime.incrementTickInterval(50);

            // [ASSERT]
            expect(gameTime.tickInterval).toBe(150);
        });
    });
});
