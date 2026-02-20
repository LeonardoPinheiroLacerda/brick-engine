import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ControlInputHandlerHelper from './ControlInputHandlerHelper';
import { ControlKey, ControlEventType } from '../types/Types';
import { Control } from '../types/modules';

// [ARRANGE] Mock configs
vi.mock('../../config/configs', () => ({
    default: {
        buttonHold: {
            holdDelayMs: 200,
            holdIntervalMs: 50,
        },
    },
}));

describe('ControlInputHandlerHelper', () => {
    let handler: ControlInputHandlerHelper;
    let mockControl: Control;

    beforeEach(() => {
        vi.useFakeTimers();
        mockControl = {
            notify: vi.fn(),
        } as unknown as Control;
        handler = new ControlInputHandlerHelper(mockControl);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('handlePress', () => {
        it('should notify PRESSED immediately when key is pressed', () => {
            // [ACT]
            handler.handlePress(ControlKey.LEFT);

            // [ASSERT]
            expect(mockControl.notify).toHaveBeenCalledWith(ControlKey.LEFT, ControlEventType.PRESSED);
        });

        it('should not notify PRESSED if the same key is already active', () => {
            // [ARRANGE]
            handler.handlePress(ControlKey.LEFT);
            vi.mocked(mockControl.notify).mockClear();

            // [ACT]
            handler.handlePress(ControlKey.LEFT);

            // [ASSERT]
            expect(mockControl.notify).not.toHaveBeenCalled();
        });

        it('should start notifying HELD after the hold delay', () => {
            // [ACT]
            handler.handlePress(ControlKey.LEFT);

            // Fast-forward past delay
            vi.advanceTimersByTime(200); // holdDelayMs

            // Fast-forward through one interval
            vi.advanceTimersByTime(50); // holdIntervalMs

            // [ASSERT]
            expect(mockControl.notify).toHaveBeenCalledWith(ControlKey.LEFT, ControlEventType.HELD);
        });

        it('should continue notifying HELD on every interval', () => {
            // [ACT]
            handler.handlePress(ControlKey.LEFT);
            vi.advanceTimersByTime(200); // skip delay

            vi.advanceTimersByTime(150); // 3 intervals

            // [ASSERT]
            // 1 (PRESSED) + 3 (HELD) = 4 notifications
            expect(mockControl.notify).toHaveBeenCalledTimes(4);
            expect(mockControl.notify).toHaveBeenLastCalledWith(ControlKey.LEFT, ControlEventType.HELD);
        });
    });

    describe('handleRelease', () => {
        it('should stop notifications and cleanup when key is released', () => {
            // [ARRANGE]
            handler.handlePress(ControlKey.LEFT);
            vi.advanceTimersByTime(200); // delay
            vi.advanceTimersByTime(50); // 1 held
            expect(mockControl.notify).toHaveBeenCalledTimes(2);

            // [ACT]
            handler.handleRelease(ControlKey.LEFT);
            vi.advanceTimersByTime(100); // advance time more

            // [ASSERT]
            expect(mockControl.notify).toHaveBeenCalledTimes(2); // Still 2
        });

        it('should handle release for a key that was not pressed gracefully', () => {
            // [ACT & ASSERT]
            expect(() => handler.handleRelease(ControlKey.RIGHT)).not.toThrow();
        });

        it('should cancel delay timer if released before it completes', () => {
            // [ARRANGE]
            handler.handlePress(ControlKey.LEFT);

            // [ACT]
            vi.advanceTimersByTime(100); // Half-way through delay
            handler.handleRelease(ControlKey.LEFT);
            vi.advanceTimersByTime(200); // Complete what would have been the delay

            // [ASSERT]
            expect(mockControl.notify).toHaveBeenCalledTimes(1); // Only PRESSED
            expect(mockControl.notify).not.toHaveBeenCalledWith(ControlKey.LEFT, ControlEventType.HELD);
        });
    });
});
