import { describe, it, expect, vi, beforeEach } from 'vitest';
import type p5 from 'p5';
import HudRenderer from './HudRenderer';
import { Color } from '../../types/enums';
import { GameModules, RendererMetrics } from '../../types/Types';

describe('HudRenderer', () => {
    let renderer: HudRenderer;
    let mockP5: Record<string, unknown>;

    beforeEach(() => {
        mockP5 = {
            push: vi.fn(),
            pop: vi.fn(),
            translate: vi.fn(),
            strokeWeight: vi.fn(),
            stroke: vi.fn(),
            noFill: vi.fn(),
            rect: vi.fn(),
            fill: vi.fn(),
            width: 1000,
            height: 1000,
        };

        renderer = new HudRenderer(mockP5 as unknown as p5);

        const metrics: RendererMetrics = {
            display: { width: 600, height: 900, origin: { x: 50, y: 50 } },
            hud: { width: 400, height: 900, origin: { x: 650, y: 50 } },
            cell: { size: 50 },
        };

        renderer.setup(metrics);
    });

    describe('render', () => {
        it('should render score and level information', () => {
            // [ARRANGE]
            const mockModules = {
                text: {
                    setTextSize: vi.fn(),
                    setInactiveText: vi.fn(),
                    setActiveText: vi.fn(),
                    setTextAlign: vi.fn(),
                    textOnHud: vi.fn(),
                },
                state: {
                    isOn: vi.fn().mockReturnValue(true),
                    isPaused: vi.fn().mockReturnValue(false),
                    isMuted: vi.fn().mockReturnValue(false),
                    isOff: vi.fn().mockReturnValue(false),
                    isPlaying: vi.fn().mockReturnValue(true),
                    isColorEnabled: vi.fn().mockReturnValue(true),
                    getHighScore: vi.fn().mockReturnValue(1000),
                },
                score: {
                    score: 500,
                    level: 1,
                    maxLevel: 10,
                },
                hudGrid: {
                    forEach: vi.fn(callback => {
                        callback({ coordinate: { x: 0, y: 0 }, value: 1, color: Color.RED });
                    }),
                },
            } as unknown as GameModules;

            // [ACT]
            renderer.render([], mockModules);

            // [ASSERT]
            expect(mockModules.text.textOnHud).toHaveBeenCalledWith('500', expect.anything());
            expect(mockModules.text.textOnHud).toHaveBeenCalledWith('1000', expect.anything());
            expect(mockModules.text.textOnHud).toHaveBeenCalledWith('01 - 10', expect.anything());
            expect(mockP5.translate).toHaveBeenCalled(); // Should have drawn the cell
            expect(mockP5.rect).toHaveBeenCalled(); // Should have drawn the border
        });

        it('should show paused status when game is paused', () => {
            // [ARRANGE]
            const mockModules = {
                text: {
                    setTextSize: vi.fn(),
                    setInactiveText: vi.fn(),
                    setActiveText: vi.fn(),
                    setTextAlign: vi.fn(),
                    textOnHud: vi.fn(),
                },
                state: {
                    isOn: vi.fn().mockReturnValue(true),
                    isPaused: vi.fn().mockReturnValue(true),
                    isMuted: vi.fn().mockReturnValue(false),
                    isOff: vi.fn().mockReturnValue(false),
                    isPlaying: vi.fn().mockReturnValue(true),
                    getHighScore: vi.fn().mockReturnValue(1000),
                },
                score: { score: 0, level: 1, maxLevel: 10 },
                hudGrid: { forEach: vi.fn() },
            } as unknown as GameModules;

            // [ACT]
            renderer.render([], mockModules);

            // [ASSERT]
            // setActiveText should be called for 'Paused'
            expect(mockModules.text.setActiveText).toHaveBeenCalled();
        });
    });
});
