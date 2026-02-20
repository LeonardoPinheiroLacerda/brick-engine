import { describe, it, expect, afterEach } from 'vitest';
import { isClientMode, isServerMode } from './env';

describe('env configuration', () => {
    const originalEnv = process.env;

    afterEach(() => {
        // Restore original env after each test
        process.env = { ...originalEnv };
    });

    describe('isClientMode', () => {
        it('should return true when APP_MODE is client', () => {
            // [ARRANGE]
            process.env.APP_MODE = 'client';

            // [ACT]
            const result = isClientMode();

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false when APP_MODE is not client', () => {
            // [ARRANGE]
            process.env.APP_MODE = 'server';

            // [ACT]
            const result = isClientMode();

            // [ASSERT]
            expect(result).toBe(false);
        });
    });

    describe('isServerMode', () => {
        it('should return true when APP_MODE is server', () => {
            // [ARRANGE]
            process.env.APP_MODE = 'server';

            // [ACT]
            const result = isServerMode();

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false when APP_MODE is not server', () => {
            // [ARRANGE]
            process.env.APP_MODE = 'client';

            // [ACT]
            const result = isServerMode();

            // [ASSERT]
            expect(result).toBe(false);
        });
    });
});
