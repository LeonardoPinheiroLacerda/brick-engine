import { describe, it, expect } from 'vitest';
import * as BrickEngine from './index';

describe('index (Library Exports)', () => {
    it('should export the core modules and configurations', () => {
        // [ASSERT]
        expect(BrickEngine.Game).toBeDefined();
        expect(BrickEngine.GameView).toBeDefined();
        expect(BrickEngine.configs).toBeDefined();

        // Exported enums/types check
        expect(BrickEngine.Color).toBeDefined();
        expect(BrickEngine.FontSize).toBeDefined();
    });
});
