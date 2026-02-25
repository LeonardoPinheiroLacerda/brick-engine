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
                isOff: vi.fn().mockReturnValue(false),
                isStarted: vi.fn().mockReturnValue(false),
                isPlaying: vi.fn().mockReturnValue(false),
                isPaused: vi.fn().mockReturnValue(false),
                isGameOver: vi.fn().mockReturnValue(false),
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

        it('should notify all subscribers of a key event during gameplay', () => {
            // [ARRANGE]
            const callback = vi.fn();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mockModules.state.isPlaying as any).mockReturnValue(true);
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mockModules.state.isPlaying as any).mockReturnValue(true);
            control.subscribe(ControlKey.UP, ControlEventType.PRESSED, callback);
            control.unsubscribe(ControlKey.UP, ControlEventType.PRESSED, callback);

            // [ACT]
            control.notify(ControlKey.UP, ControlEventType.PRESSED);

            // [ASSERT]
            expect(callback).not.toHaveBeenCalled();
        });

        it('should notify title screen subscribers when game is on but not started', () => {
            // [ARRANGE]
            const callback = vi.fn();
            control.subscribeForTitleScreen(ControlKey.ACTION, ControlEventType.PRESSED, callback);

            // [ACT]
            control.notify(ControlKey.ACTION, ControlEventType.PRESSED);
            // Default mockModules has isOn=true, isStarted=false (title screen)

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: ControlKey.ACTION,
                    type: ControlEventType.PRESSED,
                    modules: mockModules,
                }),
            );
        });

        it('should notify game over screen subscribers when game is over', () => {
            // [ARRANGE]
            const callback = vi.fn();
            control.subscribeForGameOverScreen(ControlKey.ACTION, ControlEventType.PRESSED, callback);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mockModules.state.isGameOver as any).mockReturnValue(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mockModules.state.isStarted as any).mockReturnValue(true);

            // [ACT]
            control.notify(ControlKey.ACTION, ControlEventType.PRESSED);

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: ControlKey.ACTION,
                    type: ControlEventType.PRESSED,
                    modules: mockModules,
                }),
            );
        });

        it('should notify playing screen subscribers when game is playing', () => {
            // [ARRANGE]
            const callback = vi.fn();
            control.subscribeForPlayingScreen(ControlKey.ACTION, ControlEventType.PRESSED, callback);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mockModules.state.isPlaying as any).mockReturnValue(true);

            // [ACT]
            control.notify(ControlKey.ACTION, ControlEventType.PRESSED);

            // [ASSERT]
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: ControlKey.ACTION,
                    type: ControlEventType.PRESSED,
                    modules: mockModules,
                }),
            );
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
            expect(debug.total_active_listeners).toBe(3);
        });
    });
});
