/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Trackpad from './Trackpad';
import type p5 from 'p5';
import ControlInputHandlerHelper from '../../../core/helpers/ControlInputHandlerHelper';
import RendererContext from '../../../core/context/RendererContext';

describe('Trackpad', () => {
    let mockInputHandler: ControlInputHandlerHelper;
    let mockParent: p5.Element;
    let mockP5: Record<string, unknown>;

    beforeEach(() => {
        window.ResizeObserver = class {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        } as unknown as typeof ResizeObserver;

        mockP5 = {
            createDiv: vi.fn().mockReturnValue({
                parent: vi.fn(),
                addClass: vi.fn(),
                style: vi.fn(),
                elt: document.createElement('div'),
                remove: vi.fn(),
            }),
            createP: vi.fn().mockReturnValue({
                parent: vi.fn(),
                addClass: vi.fn(),
            }),
        };

        RendererContext.reset();
        RendererContext.init(mockP5 as unknown as p5);

        mockInputHandler = {
            handlePress: vi.fn(),
            handleRelease: vi.fn(),
        } as unknown as ControlInputHandlerHelper;

        mockParent = {} as p5.Element;
    });

    it('should create and destroy a trackpad successfully', () => {
        const trackpad = new Trackpad(mockParent, mockInputHandler);
        expect(mockP5.createDiv).toHaveBeenCalled();

        trackpad.destroy();
    });
});
