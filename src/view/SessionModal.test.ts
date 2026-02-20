/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type p5 from 'p5';
import SessionModal from './SessionModal';

describe('SessionModal', () => {
    let modal: SessionModal;
    let mockP5: Record<string, unknown>;
    let mockContainer: Record<string, unknown>;
    let mockConfirmButton: Record<string, unknown>;
    let mockCancelButton: Record<string, unknown>;

    beforeEach(() => {
        // [ARRANGE]
        mockContainer = {
            parent: vi.fn(),
            id: vi.fn(),
            class: vi.fn(),
            removeClass: vi.fn(),
            addClass: vi.fn(),
        };

        mockConfirmButton = {
            parent: vi.fn(),
            class: vi.fn(),
            mousePressed: vi.fn(),
        };

        mockCancelButton = {
            parent: vi.fn(),
            class: vi.fn(),
            mousePressed: vi.fn(),
        };

        const mockGenericElement = {
            parent: vi.fn(),
            id: vi.fn(),
            html: vi.fn(),
        };

        mockP5 = {
            select: vi.fn().mockReturnValue({}), // Mock body select
            createDiv: vi.fn().mockImplementation(() => {
                // If it's the first time, return the container mock
                // Otherwise return a generic element mock
                // @ts-expect-error This is a mock function, it's fine
                if (mockP5.createDiv.mock.calls.length === 1) return mockContainer;
                return mockGenericElement;
            }),
            createP: vi.fn().mockReturnValue(mockGenericElement),
            createButton: vi.fn().mockImplementation((label: string) => {
                if (label === 'Cancel') return mockCancelButton;
                if (label === 'Confirm') return mockConfirmButton;
                return mockGenericElement;
            }),
        };

        modal = new SessionModal(mockP5 as unknown as p5);
    });

    describe('setup', () => {
        it('should create the modal DOM elements and apply classes', () => {
            // [ACT]
            modal.setup();

            // [ASSERT]
            expect(mockP5.createDiv).toHaveBeenCalled();
            expect(mockP5.createButton).toHaveBeenCalledWith('Cancel');
            expect(mockP5.createButton).toHaveBeenCalledWith('Confirm');
            expect(mockContainer.addClass).not.toHaveBeenCalled(); // Hidden class added in mock directly via class()
            expect(mockContainer.class).toHaveBeenCalledWith('hidden');
        });
    });

    describe('show', () => {
        it('should bind the click events to the buttons and remove the hidden class', () => {
            // [ARRANGE]
            modal.setup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            // [ACT]
            modal.show(onConfirm, onCancel);

            // [ASSERT]
            expect(mockConfirmButton.mousePressed).toHaveBeenCalled();
            expect(mockCancelButton.mousePressed).toHaveBeenCalled();
            expect(mockContainer.removeClass).toHaveBeenCalledWith('hidden');
        });

        it('should trigger onConfirm and hide the modal when confirm button is clicked', () => {
            // [ARRANGE]
            modal.setup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            // Extract the callback passed to mousePressed
            let confirmCallback: () => void;
            // @ts-expect-error Checking mock calls safely
            mockConfirmButton.mousePressed.mockImplementation((cb: () => void) => {
                if (cb) confirmCallback = cb;
            });

            modal.show(onConfirm, onCancel);

            // [ACT]
            confirmCallback!();

            // [ASSERT]
            expect(onConfirm).toHaveBeenCalled();
            expect(mockContainer.addClass).toHaveBeenCalledWith('hidden');
        });

        it('should trigger onCancel and hide the modal when cancel button is clicked', () => {
            // [ARRANGE]
            modal.setup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            // Extract the callback passed to mousePressed
            let cancelCallback: () => void;
            // @ts-expect-error Checking mock calls safely
            mockCancelButton.mousePressed.mockImplementation((cb: () => void) => {
                if (cb) cancelCallback = cb;
            });

            modal.show(onConfirm, onCancel);

            // [ACT]
            cancelCallback!();

            // [ASSERT]
            expect(onCancel).toHaveBeenCalled();
            expect(mockContainer.addClass).toHaveBeenCalledWith('hidden');
        });
    });
});
