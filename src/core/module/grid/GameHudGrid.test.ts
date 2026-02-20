import { describe, it, expect, beforeEach } from 'vitest';
import GameHudGrid from './GameHudGrid';

describe('GameHudGrid', () => {
    let hudGrid: GameHudGrid;

    beforeEach(() => {
        hudGrid = new GameHudGrid();
        hudGrid.setup();
    });

    it('should have fixed dimensions 4x4', () => {
        expect(hudGrid.width).toBe(4);
        expect(hudGrid.height).toBe(4);
    });

    it('should initialize a 4x4 internal grid', () => {
        const data = hudGrid.getGrid();
        expect(data.length).toBe(4);
        expect(data[0].length).toBe(4);
    });
});
