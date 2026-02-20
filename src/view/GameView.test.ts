/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import GameView from './GameView';
import type p5 from 'p5';
import { ControlKey } from '../core/types/enums';
import { Control } from '../core/types/modules';

const { createMockButton } = vi.hoisted(() => ({
    createMockButton: () => ({
        mousePressed: vi.fn().mockReturnThis(),
        mouseReleased: vi.fn().mockReturnThis(),
        mouseOut: vi.fn().mockReturnThis(),
    }),
}));

// Mock sub-components/layouts
vi.mock('./theme/applyColors', () => ({ default: vi.fn() }));
vi.mock('./theme/dimensions', () => ({ default: vi.fn() }));
vi.mock('./components/layout/ButtonLayout', () => ({
    default: vi.fn().mockReturnValue({
        largeButtonContainer: {},
        smallButtonContainer: {},
        directionHorizontalContainer: {},
        directionVerticalContainer: {},
    }),
}));
vi.mock('./components/layout/ContainerLayout', () => ({
    default: vi.fn().mockReturnValue({ container: {}, height: 800, width: 400 }),
}));
vi.mock('./components/layout/FrameLayout', () => ({ default: vi.fn() }));
vi.mock('./components/ui/BigButton', () => ({ default: vi.fn().mockImplementation(createMockButton) }));
vi.mock('./components/ui/Button', () => ({ default: vi.fn().mockImplementation(createMockButton) }));
vi.mock('./components/ui/Canvas', () => ({
    default: vi.fn().mockReturnValue({ canvas: {}, canvasHeight: 500, canvasWidth: 400 }),
}));
vi.mock('./components/ui/SmallButton', () => ({ default: vi.fn().mockImplementation(createMockButton) }));

describe('GameView', () => {
    let gameView: GameView;
    let mockP5: Record<string, unknown>;
    let parent: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="splash"></div>';
        parent = document.body;
        mockP5 = {};
        gameView = new GameView(mockP5 as unknown as p5, parent);
    });

    it('should build the game body', () => {
        // [ACT]
        const result = gameView.build();

        // [ASSERT]
        expect(result.canvasWidth).toBe(400);
        expect(gameView.isBodyBuilt()).toBe(true);
    });

    it('should bind controls to buttons', () => {
        // [ARRANGE]
        gameView.build();
        const mockControl = { notify: vi.fn() };

        // [ACT]
        gameView.bindControls(mockControl as unknown as Control);

        // Accessing private buttons for check
        // @ts-expect-error - testing private property
        const actionBtn = gameView._actionBtn;
        expect(actionBtn.mousePressed).toHaveBeenCalled();

        // Trigger a click simulation
        const pressHandler = (actionBtn.mousePressed as unknown as Mock).mock.calls[0][0];
        pressHandler();

        expect(mockControl.notify).toHaveBeenCalledWith(ControlKey.ACTION, expect.anything());
    });

    it('should unbind controls', () => {
        // [ARRANGE]
        gameView.build();
        gameView.bindControls({ notify: vi.fn() } as unknown as Control);

        // @ts-expect-error - testing private property
        const actionBtn = gameView._actionBtn;
        const initialCalls = (actionBtn.mousePressed as unknown as Mock).mock.calls.length;

        // [ACT]
        gameView.unbindControls();

        // [ASSERT]
        // Should have been called again to override with empty func
        expect(actionBtn.mousePressed).toHaveBeenCalledTimes(initialCalls + 1);
    });
});
