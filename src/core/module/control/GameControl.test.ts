import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameControl from './GameControl';
import { ControlKey, ControlEventType } from '../../types/enums';
import { GameModules } from '../../types/Types';
import { State } from '../../types/modules';

describe('GameControl', () => {
    let control: GameControl;
    let mockModules: GameModules;

    beforeEach(() => {
        control = new GameControl();
        mockModules = {
            state: {
                isOn: vi.fn().mockReturnValue(true),
            } as unknown as State,
        } as GameModules;
        control.setModules(mockModules);
    });

    describe('notify', () => {
        it('should throw error if modules are not set', () => {
            // [ARRANGE]
            const freshControl = new GameControl();

            // [ACT & ASSERT]
            expect(() => freshControl.notify(ControlKey.UP, ControlEventType.PRESSED)).toThrow('Modules not initialized');
        });

        it('should notify all subscribers of a key event', () => {
            // [ARRANGE]
            const callback = vi.fn();
            control.subscribe(ControlKey.UP, ControlEventType.PRESSED, callback);

            // [ACT]
            control.notify(ControlKey.UP, ControlEventType.PRESSED);

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: ControlKey.UP,
                    type: ControlEventType.PRESSED,
                    modules: mockModules,
                }),
            );
        });

        it('should not notify unsubscribed callbacks', () => {
            // [ARRANGE]
            const callback = vi.fn();
            control.subscribe(ControlKey.UP, ControlEventType.PRESSED, callback);
            control.unsubscribe(ControlKey.UP, ControlEventType.PRESSED, callback);

            // [ACT]
            control.notify(ControlKey.UP, ControlEventType.PRESSED);

            // [ASSERT]
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('getDebugData', () => {
        it('should return subscriber counts', () => {
            // [ARRANGE]
            control.subscribe(ControlKey.UP, ControlEventType.PRESSED, vi.fn());
            control.subscribe(ControlKey.DOWN, ControlEventType.PRESSED, vi.fn());
            control.subscribe(ControlKey.DOWN, ControlEventType.HELD, vi.fn());

            // [ACT]
            const debug = control.getDebugData();

            // [ASSERT]
            expect(debug.total_subscribers).toBe(3);
            expect(debug.tracked_keys).toBe(2); // UP and DOWN
        });
    });
});
