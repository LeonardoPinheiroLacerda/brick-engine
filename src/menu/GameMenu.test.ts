/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameMenu from './GameMenu';
import GameView from '../view/GameView';
import p5 from 'p5';
import { ControlEventType, ControlKey } from '../core/types/enums';

// Mock GameRepository to avoid external dependencies
vi.mock('./GameRepository', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                games: [
                    { name: 'Game 1', url: 'url1' },
                    { name: 'Game 2', url: 'url2' },
                ],
            };
        }),
    };
});

// Mock GameManager
vi.mock('./manager/GameManager', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                handleGameSwitch: vi.fn(),
            };
        }),
    };
});

describe('GameMenu', () => {
    let menu: GameMenu;
    let mockP5: Record<string, unknown>;
    let mockView: Record<string, unknown>;

    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue(null),
            setItem: vi.fn(),
            clear: vi.fn(),
        });

        vi.stubGlobal(
            'AudioContext',
            vi.fn().mockImplementation(function () {
                return {
                    createGain: vi.fn().mockReturnValue({
                        connect: vi.fn(),
                        gain: { setValueAtTime: vi.fn() },
                    }),
                    createBufferSource: vi.fn().mockReturnValue({
                        connect: vi.fn(),
                        start: vi.fn(),
                        buffer: null,
                    }),
                    destination: {},
                    decodeAudioData: vi.fn().mockResolvedValue({}),
                    resume: vi.fn().mockResolvedValue({}),
                };
            }),
        );

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
            }),
        );

        mockP5 = {
            deltaTime: 16,
            noLoop: vi.fn(),
            push: vi.fn(),
            pop: vi.fn(),
            translate: vi.fn(),
            strokeWeight: vi.fn(),
            stroke: vi.fn(),
            noFill: vi.fn(),
            rect: vi.fn(),
            fill: vi.fn(),
            text: vi.fn(),
            textFont: vi.fn(),
            textSize: vi.fn(),
            textAlign: vi.fn(),
            image: vi.fn(),
            createGraphics: vi.fn().mockReturnValue({
                background: vi.fn(),
                strokeWeight: vi.fn(),
                noFill: vi.fn(),
                stroke: vi.fn(),
                rect: vi.fn(),
            }),
        };

        mockView = {
            build: vi.fn(),
            bindControls: vi.fn(),
        };

        menu = new GameMenu(mockP5 as unknown as p5, mockView as unknown as GameView);
        menu.setup();
    });

    it('should cycle through games on LEFT/RIGHT arrow press', () => {
        const { control, state } = menu.modules;

        // Ensure game is ON and STARTED/PLAYING
        state.turnOn();
        state.startGame();

        expect(state.isPlaying()).toBe(true);

        // Initial selection should be 0 (Game 1)
        expect((menu as unknown as Record<string, unknown>)['_gameSelectionPointer']).toBe(0);

        // Press RIGHT
        control.notify(ControlKey.RIGHT, ControlEventType.PRESSED);
        expect((menu as unknown as Record<string, unknown>)['_gameSelectionPointer']).toBe(1);

        // Press RIGHT again (should cycle)
        control.notify(ControlKey.RIGHT, ControlEventType.PRESSED);
        expect((menu as unknown as Record<string, unknown>)['_gameSelectionPointer']).toBe(0);

        // Press LEFT (should cycle back)
        control.notify(ControlKey.LEFT, ControlEventType.PRESSED);
        expect((menu as unknown as Record<string, unknown>)['_gameSelectionPointer']).toBe(1);
    });

    it('should handle game switch on ACTION press', () => {
        const { control, state } = menu.modules;
        state.turnOn();
        state.startGame();

        expect(state.isStarted()).toBe(true);

        const managerSpy = (menu as unknown as { _gameManager: { handleGameSwitch: import('vitest').Mock } })._gameManager.handleGameSwitch;

        control.notify(ControlKey.ACTION, ControlEventType.PRESSED);

        expect(managerSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'Game 1' }), menu);
    });

    it('should play theme when turned on', () => {
        const { state, sound } = menu.modules;

        // Mock play to resolve
        const soundSpy = vi.spyOn(sound, 'play').mockResolvedValue(undefined as unknown as void);

        state.turnOn();

        expect(state.isOn()).toBe(true);
        expect(soundSpy).toHaveBeenCalled();
    });
});
