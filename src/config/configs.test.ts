import { describe, it, expect } from 'vitest';
import configs from './configs';

describe('configs', () => {
    it('should export an object containing configuration values', () => {
        // [ARRANGE & ACT]
        const configSnapshot = configs;

        // [ASSERT]
        expect(configSnapshot).toBeDefined();
        expect(configSnapshot.game).toBeDefined();
        expect(configSnapshot.screenLayout).toBeDefined();
        expect(configSnapshot.colors).toBeDefined();
    });

    it('should have read-only immutable structure based on as const declaration', () => {
        // [ASSERT]
        expect(configs.colors.background).toBe('rgb(172, 189, 173)');
    });
});
