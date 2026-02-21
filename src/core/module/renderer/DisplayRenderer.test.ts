import { describe, it, expect, vi, beforeEach } from 'vitest';
import type p5 from 'p5';
import DisplayRenderer from './DisplayRenderer';
import { Color } from '../../types/enums';
import { GameModules } from '../../types/Types';
import { State } from '../../types/modules';

describe('DisplayRenderer', () => {
    let renderer: DisplayRenderer;
    let mockP5: Record<string, unknown>;
    let mockGraphics: Record<string, unknown>;

    beforeEach(() => {
        mockGraphics = {
            background: vi.fn(),
            strokeWeight: vi.fn(),
            noFill: vi.fn(),
            stroke: vi.fn(),
            rect: vi.fn(),
        };

        mockP5 = {
            createGraphics: vi.fn().mockReturnValue(mockGraphics),
            push: vi.fn(),
            pop: vi.fn(),
            image: vi.fn(),
            translate: vi.fn(),
            strokeWeight: vi.fn(),
            stroke: vi.fn(),
            noFill: vi.fn(),
            rect: vi.fn(),
            fill: vi.fn(),
            width: 1000,
            height: 1000,
        };

        renderer = new DisplayRenderer(mockP5 as unknown as p5);
        renderer.setup({
            display: { width: 600, height: 900, origin: { x: 50, y: 50 } },
            hud: { width: 400, height: 900, origin: { x: 650, y: 50 } },
            cell: { size: 50 },
        });
    });

    describe('render', () => {
        it('should draw static background and then grid cells', () => {
            // [ARRANGE]
            const grid = [[{ coordinate: { x: 0, y: 0 }, value: 1, color: Color.RED }]];
            const mockModules = {
                state: { isColorEnabled: () => true, isPlaying: () => true },
            } as unknown as GameModules;

            // [ACT]
            renderer.render(grid, mockModules);

            // [ASSERT]
            expect(mockP5.image).toHaveBeenCalledWith(mockGraphics, 0, 0);
            expect(mockP5.translate).toHaveBeenCalledWith(50, 50); // display origin + 0*50
            expect(mockP5.rect).toHaveBeenCalled();
        });
    });

    describe('renderCell', () => {
        it('should use DEFAULT color if color mode is disabled', () => {
            const cell = { coordinate: { x: 0, y: 0 }, value: 1, color: Color.RED };
            const mockState = { isColorEnabled: () => false, isPlaying: () => true } as unknown as State;

            // [ACT]
            (renderer as unknown as { renderCell: (c: unknown, s: unknown) => void })['renderCell'](cell, mockState);

            // [ASSERT]
            expect(mockP5.stroke).toHaveBeenCalledWith(Color.DEFAULT);
        });

        it('should use INACTIVE color if cell value is 0', () => {
            const cell = { coordinate: { x: 0, y: 0 }, value: 0, color: Color.RED };
            const mockState = { isColorEnabled: () => true, isPlaying: () => true } as unknown as State;

            // [ACT]
            (renderer as unknown as { renderCell: (c: unknown, s: unknown) => void })['renderCell'](cell, mockState);

            // [ASSERT]
            expect(mockP5.stroke).toHaveBeenCalledWith(Color.INACTIVE);
        });
    });
});
