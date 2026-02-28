import { Serializable } from '../../types/Interfaces';
import GameGrid from './GameGrid';

/**
 * Specialized engine module isolating the visual preview logic for upcoming pieces.
 *
 * It statically overrides the fluid grid dimensions strictly to a 4x4 coordinate plane.
 * By extending the core {@link GameGrid}, it transparently inherits all complex collision
 * and stamping logic without polluting the global game field with temporary shapes.
 */
export default class GameHudGrid extends GameGrid implements Serializable {
    serialId: string = 'hud_grid';

    /**
     * Statically overrides the dynamic configuration to enforce a perfect 4x4 box.
     *
     * @returns {number} The strict integer width threshold (always 4).
     */
    get width(): number {
        return 4;
    }

    /**
     * Statically overrides the dynamic configuration to enforce a perfect 4x4 box.
     *
     * @returns {number} The strict integer height threshold (always 4).
     */
    get height(): number {
        return 4;
    }

    serialize(): string {
        return JSON.stringify({
            grid: this._grid,
        });
    }

    deserialize(data: string): void {
        const parsed = JSON.parse(data);
        this._grid = parsed.grid;
    }
}
