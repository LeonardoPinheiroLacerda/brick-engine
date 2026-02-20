import { describe, it, expect, vi, beforeEach } from 'vitest';
import type p5 from 'p5';
import GameRenderer from './GameRenderer';
import { Renderer } from '../../types/modules';
import { Cell, GameModules } from '../../types/Types';

describe('GameRenderer', () => {
    let gameRenderer: GameRenderer;
    let mockP5: Record<string, unknown>;

    beforeEach(() => {
        mockP5 = {
            width: 1000,
            height: 1000,
            push: vi.fn(),
            pop: vi.fn(),
            image: vi.fn(),
            translate: vi.fn(),
            strokeWeight: vi.fn(),
            stroke: vi.fn(),
            noFill: vi.fn(),
            rect: vi.fn(),
            fill: vi.fn(),
            createGraphics: vi.fn().mockReturnValue({
                background: vi.fn(),
                strokeWeight: vi.fn(),
                noFill: vi.fn(),
                stroke: vi.fn(),
                rect: vi.fn(),
            }),
        };

        gameRenderer = new GameRenderer(mockP5 as unknown as p5);
    });

    describe('setup', () => {
        it('should calculate metrics and initialize sub-renderers', () => {
            // [ACT]
            gameRenderer.setup();

            // [ASSERT]
            const metrics = gameRenderer.rendererMetrics;
            expect(metrics).toBeDefined();
            expect(metrics.display.width).toBeGreaterThan(0);
            expect(metrics.cell.size).toBeGreaterThan(0);
        });
    });

    describe('render', () => {
        it('should delegate render to all sub-renderers', () => {
            // [ARRANGE]
            gameRenderer.setup();

            const mockRenderer = {
                setup: vi.fn(),
                render: vi.fn(),
            };
            gameRenderer.addRenderer(mockRenderer as unknown as Renderer);

            const grid: Cell[][] = [];
            const modules = {
                text: {
                    setTextSize: vi.fn(),
                    setInactiveText: vi.fn(),
                    setTextAlign: vi.fn(),
                    textOnHud: vi.fn(),
                    setActiveText: vi.fn(),
                    setRendererMetrics: vi.fn(),
                },
                state: {
                    isOn: vi.fn().mockReturnValue(true),
                    isPaused: vi.fn().mockReturnValue(false),
                    isMuted: vi.fn().mockReturnValue(false),
                    isOff: vi.fn().mockReturnValue(false),
                    isPlaying: vi.fn().mockReturnValue(true),
                    isColorEnabled: vi.fn().mockReturnValue(true),
                    getHighScore: vi.fn().mockReturnValue(0),
                },
                score: { score: 0, level: 1, maxLevel: 10 },
                hudGrid: { forEach: vi.fn() },
            } as unknown as GameModules;

            // [ACT]
            gameRenderer.render(grid, modules);

            // [ASSERT]
            expect(mockRenderer.render).toHaveBeenCalled();
        });
    });

    describe('Debug', () => {
        it('should return correct debug data after setup', () => {
            // [ARRANGE]
            gameRenderer.setup();

            // [ACT]
            const debug = gameRenderer.getDebugData();

            // [ASSERT]
            expect(debug.display_width).toBeDefined();
            expect(debug.cell_size).toBeDefined();
        });
    });
});
