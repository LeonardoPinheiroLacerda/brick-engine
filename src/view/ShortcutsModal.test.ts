/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShortcutsModal from './ShortcutsModal';
import RendererContext from '../core/context/RendererContext';
import p5 from 'p5';

describe('ShortcutsModal', () => {
    let modal: ShortcutsModal;
    let mockP5: Record<string, unknown>;
    let mockContainer: Record<string, unknown>;
    let mockExternalButton: Record<string, unknown>;
    let mockCloseButton: Record<string, unknown>;

    beforeEach(() => {
        // [ARRANGE]
        mockContainer = {
            parent: vi.fn(),
            id: vi.fn(),
            class: vi.fn(),
            hasClass: vi.fn(),
            removeClass: vi.fn(),
            addClass: vi.fn(),
        };

        mockExternalButton = {
            parent: vi.fn(),
            id: vi.fn(),
            mousePressed: vi.fn(),
        };

        mockCloseButton = {
            parent: vi.fn(),
            id: vi.fn(),
            mousePressed: vi.fn(),
        };

        mockP5 = {
            createButton: vi.fn(text => {
                if (text.includes('Shortcuts')) return mockExternalButton;
                if (text === 'Close') return mockCloseButton;
                return {};
            }),
            createDiv: vi.fn(() => mockContainer),
            createElement: vi.fn(() => ({ parent: vi.fn(), html: vi.fn() })),
            createSpan: vi.fn(() => ({ parent: vi.fn(), class: vi.fn(), html: vi.fn() })),
            select: vi.fn().mockReturnValue({}),
        };

        RendererContext.init(mockP5 as unknown as p5);
        modal = new ShortcutsModal();
    });

    it('should create DOM elements during setup', () => {
        // [ACT]
        modal.setup();

        // [ASSERT]
        expect(mockP5.createButton).toHaveBeenCalledWith('Shortcuts [H]');
        expect(mockP5.createDiv).toHaveBeenCalled();
        expect(mockExternalButton.id).toHaveBeenCalledWith('btn-shortcuts-external');
        expect(mockContainer.id).toHaveBeenCalledWith('shortcuts-modal-background');
    });

    it('should toggle visibility when toggle is called', () => {
        // [ARRANGE]
        modal.setup();
        (mockContainer.hasClass as import('vitest').Mock).mockReturnValue(true); // Is hidden

        // [ACT]
        modal.toggle();

        // [ASSERT]
        expect(mockContainer.removeClass).toHaveBeenCalledWith('hidden');

        // [ARRANGE]
        (mockContainer.hasClass as import('vitest').Mock).mockReturnValue(false); // Is visible

        // [ACT]
        modal.toggle();

        // [ASSERT]
        expect(mockContainer.addClass).toHaveBeenCalledWith('hidden');
    });

    it('should hide modal when close button is pressed', () => {
        // [ARRANGE]
        modal.setup();
        const closeHandler = (mockCloseButton.mousePressed as import('vitest').Mock).mock.calls[0][0];

        // [ACT]
        closeHandler();

        // [ASSERT]
        expect(mockContainer.addClass).toHaveBeenCalledWith('hidden');
    });
});
