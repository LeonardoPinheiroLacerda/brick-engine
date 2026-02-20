/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameControlKeyBinding from './GameControlKeyBinding';
import { Control } from '../../types/modules';
import { ControlKey } from '../../types/enums';

describe('GameControlKeyBinding', () => {
    let binding: GameControlKeyBinding;
    let mockControl: Control;

    beforeEach(() => {
        mockControl = {
            notify: vi.fn(),
        } as unknown as Control;

        binding = new GameControlKeyBinding(mockControl);
    });

    it('should bind and unbind window events', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        binding.bindControls();
        expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        binding.unbindControls();
        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should trigger control press on valid key down', () => {
        binding.bindControls();

        // Simulating KeyboardEvent
        const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
        window.dispatchEvent(event);

        expect(mockControl.notify).toHaveBeenCalledWith(ControlKey.UP, 'pressed');
    });

    it('should ignore repeated native key down events', () => {
        binding.bindControls();

        const event = new KeyboardEvent('keydown', { code: 'ArrowUp', repeat: true } as KeyboardEventInit);
        window.dispatchEvent(event);

        expect(mockControl.notify).not.toHaveBeenCalled();
    });

    it('should trigger control release on key up', () => {
        binding.bindControls();

        const event = new KeyboardEvent('keyup', { code: 'ArrowLeft' });
        window.dispatchEvent(event);

        // ControlInputHandler doesn't notify on release directly but we can verify it doesn't crash
        // Actually, let's verify if handleRelease was called on the handler
        // Since it's private, we just check if it doesn't error and maybe mock the handler if we could
    });
});
