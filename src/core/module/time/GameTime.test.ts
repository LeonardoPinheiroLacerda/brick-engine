import { describe, it, expect, beforeEach } from 'vitest';
import GameTime from './GameTime';

describe('GameTime', () => {
    let gameTime: GameTime;

    beforeEach(() => {
        gameTime = new GameTime();
        gameTime.setup();
    });

    describe('update & shouldTick', () => {
        it('should accumulate time and trigger tick when interval is reached', () => {
            const tickMs = 1000 / 60;
            // [ACT]
            gameTime.accumulate(tickMs / 2);
            const firstCheck = gameTime.shouldTick();

            gameTime.accumulate(tickMs / 2);
            const secondCheck = gameTime.shouldTick();

            // [ASSERT]
            expect(firstCheck).toBe(false);
            expect(secondCheck).toBe(true);
        });

        it('should handle multiple ticks in one large update', () => {
            const tickMs = 1000 / 60;
            // [ACT]
            gameTime.accumulate(tickMs * 2.5);

            const tick1 = gameTime.shouldTick(); // consumes 1 tick
            const tick2 = gameTime.shouldTick(); // consumes 2nd tick
            const tick3 = gameTime.shouldTick(); // no 3rd tick

            // [ASSERT]
            expect(tick1).toBe(true);
            expect(tick2).toBe(true);
            expect(tick3).toBe(false);
        });

        it('should track totalTicks and elapsedTime', () => {
            const tickMs = 1000 / 60;
            // [ACT]
            gameTime.update(tickMs);
            gameTime.accumulate(tickMs);
            gameTime.shouldTick();
            gameTime.update(tickMs);
            gameTime.accumulate(tickMs);
            gameTime.shouldTick();

            // [ASSERT]
            expect(gameTime.totalTicks).toBe(2);
            expect(gameTime.elapsedTime).toBe(tickMs * 2);
        });

        it('should return true for isEveryMs at correct multiples', () => {
            const tickMs = 1000 / 60;
            // [ARRANGE]
            gameTime.accumulate(tickMs);
            gameTime.shouldTick(); // Tick 1 (16.66ms)

            // [ASSERT]
            expect(gameTime.atInterval(tickMs * 2)).toBe(false);

            // [ACT]
            gameTime.accumulate(tickMs);
            gameTime.shouldTick(); // Tick 2 (33.33ms)

            // [ASSERT]
            expect(gameTime.atInterval(tickMs * 2)).toBe(true);
            expect(gameTime.atInterval(tickMs * 3)).toBe(false);

            // [ACT]
            gameTime.accumulate(tickMs);
            gameTime.shouldTick(); // Tick 3 (50ms)

            // [ASSERT]
            expect(gameTime.atInterval(tickMs * 3)).toBe(true);
            expect(gameTime.atInterval(tickMs * 2)).toBe(false);
        });

        it('should return false for atInterval at tick 0', () => {
            expect(gameTime.totalTicks).toBe(0);
            expect(gameTime.atInterval(1)).toBe(false);
        });

        it('should execute action only at correct intervals via every', () => {
            const tickMs = 1000 / 60;
            // [ARRANGE]
            let counter = 0;
            const action = () => {
                counter++;
            };

            // [ACT & ASSERT] - Tick 1
            gameTime.accumulate(tickMs);
            gameTime.shouldTick();
            gameTime.every(tickMs * 2, action);
            expect(counter).toBe(0);

            // [ACT & ASSERT] - Tick 2
            gameTime.accumulate(tickMs);
            gameTime.shouldTick();
            gameTime.every(tickMs * 2, action);
            expect(counter).toBe(1);

            // [ACT & ASSERT] - Tick 3
            gameTime.accumulate(tickMs);
            gameTime.shouldTick();
            gameTime.every(tickMs * 2, action);
            expect(counter).toBe(1);

            // [ACT & ASSERT] - Tick 4
            gameTime.accumulate(tickMs);
            gameTime.shouldTick();
            gameTime.every(tickMs * 2, action);
            expect(counter).toBe(2);
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
                gameTime.update(100);
                gameTime.accumulate(100);
                gameTime.shouldTick();
            }

            // [ACT]
            gameTime.update(500); // 5*100 + 500 = 1000ms elapsed

            // [ASSERT]
            const debug = gameTime.getDebugData();
            expect(debug.tps).toBe(5);
        });
    });
});
