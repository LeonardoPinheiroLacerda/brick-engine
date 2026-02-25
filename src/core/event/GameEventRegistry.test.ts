import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import GameEventRegistry from './GameEventRegistry';
import { ControlKey, ControlEventType, StateProperty, GameModules } from '../types/Types';
import { Control, State, Session, SoundModule, Grid, Score, Time } from '../types/modules';

describe('GameEventRegistry', () => {
    let mockControl: Control;
    let mockState: State;
    let mockSession: Session;
    let mockSound: SoundModule;
    let mockGrid: Grid;
    let mockScore: Score;
    let mockTime: Time;
    let modules: GameModules;
    let onReset: Mock;

    // Helper to capture subscribers
    const controlSubscribers: Record<string, (payload?: unknown) => void> = {};
    const stateSubscribers: Record<string, (payload?: unknown) => void> = {};

    beforeEach(() => {
        onReset = vi.fn();

        mockControl = {
            subscribe: vi.fn((key, type, cb) => {
                controlSubscribers[`${key}:${type}`] = cb;
            }),
            subscribeForTitleScreen: vi.fn((key, type, cb) => {
                controlSubscribers[`${key}:${type}:title`] = cb;
            }),
            subscribeForPlayingScreen: vi.fn((key, type, cb) => {
                controlSubscribers[`${key}:${type}:playing`] = cb;
            }),
            subscribeForGameOverScreen: vi.fn((key, type, cb) => {
                controlSubscribers[`${key}:${type}:gameover`] = cb;
            }),
            subscribeForPausedScreen: vi.fn((key, type, cb) => {
                controlSubscribers[`${key}:${type}:paused`] = cb;
            }),
        } as unknown as Control;

        mockState = {
            toggleMuted: vi.fn(),
            toggleColorEnabled: vi.fn(),
            isOn: vi.fn(),
            turnOn: vi.fn(),
            turnOff: vi.fn(),
            resetGameOver: vi.fn(),
            startGame: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            resetGame: vi.fn(),
            subscribe: vi.fn((prop, cb) => {
                stateSubscribers[prop] = cb;
            }),
            subscribeForGameOverScreen: vi.fn((prop, cb) => {
                stateSubscribers[`${prop}:gameover`] = cb;
            }),
        } as unknown as State;

        mockSession = { clearSession: vi.fn() } as unknown as Session;
        mockSound = { stopAll: vi.fn() } as unknown as SoundModule;
        mockGrid = { resetGrid: vi.fn() } as unknown as Grid;
        mockScore = { resetScore: vi.fn(), resetLevel: vi.fn() } as unknown as Score;
        mockTime = { reset: vi.fn() } as unknown as Time;

        modules = {
            control: mockControl,
            state: mockState,
            session: mockSession,
            sound: mockSound,
            grid: mockGrid,
            score: mockScore,
            time: mockTime,
        } as unknown as GameModules;

        // Reset captured subscribers
        Object.keys(controlSubscribers).forEach(key => delete controlSubscribers[key]);
        Object.keys(stateSubscribers).forEach(key => delete stateSubscribers[key]);
    });

    describe('setupControlEvents', () => {
        beforeEach(() => {
            GameEventRegistry.setupControlEvents(modules, onReset);
        });

        it('should toggle sound when SOUND key is pressed', () => {
            // [ACT]
            controlSubscribers[`${ControlKey.SOUND}:${ControlEventType.PRESSED}`]();

            // [ASSERT]
            expect(mockState.toggleMuted).toHaveBeenCalled();
        });

        it('should toggle color when COLOR key is pressed', () => {
            // [ACT]
            controlSubscribers[`${ControlKey.COLOR}:${ControlEventType.PRESSED}`]();

            // [ASSERT]
            expect(mockState.toggleColorEnabled).toHaveBeenCalled();
        });

        it('should clear session when EXIT key is pressed', () => {
            // [ACT]
            controlSubscribers[`${ControlKey.EXIT}:${ControlEventType.PRESSED}`]();

            // [ASSERT]
            expect(mockSession.clearSession).toHaveBeenCalled();
        });

        describe('Power Button', () => {
            it('should turn off and stop sound when POWER is pressed and system is ON', () => {
                // [ARRANGE]
                vi.mocked(mockState.isOn).mockReturnValue(true);

                // [ACT]
                controlSubscribers[`${ControlKey.POWER}:${ControlEventType.PRESSED}`]();

                // [ASSERT]
                expect(mockState.turnOff).toHaveBeenCalled();
                expect(mockSound.stopAll).toHaveBeenCalled();
            });

            it('should turn on when POWER is pressed and system is OFF', () => {
                // [ARRANGE]
                vi.mocked(mockState.isOn).mockReturnValue(false);

                // [ACT]
                controlSubscribers[`${ControlKey.POWER}:${ControlEventType.PRESSED}`]();

                // [ASSERT]
                expect(mockState.turnOn).toHaveBeenCalled();
            });

            it('should perform reset when POWER is pressed on Game Over screen', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.POWER}:${ControlEventType.PRESSED}:gameover`]();

                // [ASSERT]
                expect(onReset).toHaveBeenCalled();
                expect(mockState.resetGameOver).toHaveBeenCalled();
            });
        });

        describe('Start / Pause Button', () => {
            it('should start game when pressed on Title screen', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.START_PAUSE}:${ControlEventType.PRESSED}:title`]();

                // [ASSERT]
                expect(mockState.startGame).toHaveBeenCalled();
            });

            it('should pause game when pressed while playing', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.START_PAUSE}:${ControlEventType.PRESSED}:playing`]();

                // [ASSERT]
                expect(mockState.pause).toHaveBeenCalled();
            });

            it('should perform full reset when pressed on Game Over screen', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.START_PAUSE}:${ControlEventType.PRESSED}:gameover`]();

                // [ASSERT]
                expect(onReset).toHaveBeenCalled();
                expect(mockState.resetGameOver).toHaveBeenCalled();
            });

            it('should resume game when pressed while paused', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.START_PAUSE}:${ControlEventType.PRESSED}:paused`]();

                // [ASSERT]
                expect(mockState.resume).toHaveBeenCalled();
            });
        });

        describe('Reset Button', () => {
            it('should perform full reset when pressed while playing', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.RESET}:${ControlEventType.PRESSED}:playing`]();

                // [ASSERT]
                expect(onReset).toHaveBeenCalled();
                expect(mockState.resetGame).toHaveBeenCalled();
            });

            it('should perform full reset when pressed while paused', () => {
                // [ACT]
                controlSubscribers[`${ControlKey.RESET}:${ControlEventType.PRESSED}:paused`]();

                // [ASSERT]
                expect(onReset).toHaveBeenCalled();
                expect(mockState.resetGame).toHaveBeenCalled();
            });
        });
    });

    describe('setupStateEvents', () => {
        beforeEach(() => {
            GameEventRegistry.setupStateEvents(modules);
        });

        it('should reset modules when system is turned OFF', () => {
            // [ACT]
            stateSubscribers[StateProperty.ON](false);

            // [ASSERT]
            expect(mockGrid.resetGrid).toHaveBeenCalled();
            expect(mockScore.resetScore).toHaveBeenCalled();
        });

        it('should NOT reset modules when system is turned ON', () => {
            // [ACT]
            stateSubscribers[StateProperty.ON](true);

            // [ASSERT]
            expect(mockGrid.resetGrid).not.toHaveBeenCalled();
        });

        it('should clear session on Game Over screen property change', () => {
            // [ACT]
            stateSubscribers[`${StateProperty.GAME_OVER}:gameover`](true);

            // [ASSERT]
            expect(mockSession.clearSession).toHaveBeenCalled();
        });
    });
});
