/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Game from './Game';
import p5 from 'p5';
import type GameView from '../view/GameView';
import { ControlEventType, ControlKey } from './types/Types';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();
vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal(
    'AudioContext',
    vi.fn().mockImplementation(function () {
        return {
            createGain: vi.fn().mockReturnValue({
                connect: vi.fn(),
                gain: { setValueAtTime: vi.fn() },
            }),
            destination: {},
        };
    }),
);

class MockGame extends Game {
    update = vi.fn();
    render = vi.fn();
    setupGame = vi.fn();
    getPersistenceKey = () => 'test-game';
    drawTitleScreen = vi.fn();
    drawGameOverScreen = vi.fn();
}

describe('Game', () => {
    let game: MockGame;
    let mockP5: Record<string, unknown>;
    let mockView: GameView;

    beforeEach(() => {
        mockP5 = {
            deltaTime: 16.6,
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
        } as unknown as GameView;

        game = new MockGame(mockP5 as unknown as p5, mockView);
    });

    describe('setup', () => {
        it('should initialize all modules and sync state', () => {
            // [ACT]
            game.setup();

            // [ASSERT]
            expect(game.modules).toBeDefined();
            expect(game.modules.state).toBeDefined();
            expect(game.modules.grid).toBeDefined();
            expect(mockView.build).toHaveBeenCalled();
            expect(game.setupGame).toHaveBeenCalled();
        });
    });

    describe('draw', () => {
        beforeEach(() => {
            game.setup();
        });

        it('should render title screen if game is ON but not STARTED', () => {
            // [ARRANGE]
            game.modules.state.turnOn();
            // state.isStarted() is false by default

            // [ACT]
            game.draw();

            // [ASSERT]
            expect(game.drawTitleScreen).toHaveBeenCalled();
        });

        it('should update and render if game is PLAYING', () => {
            // [ARRANGE]
            game.modules.state.turnOn();
            game.modules.state.startGame(); // sets started and playing to true

            // Mock time to trigger tick
            // Tick interval is in configs, let's assume 1000ms
            game.modules.time.update(2000);

            // [ACT]
            game.draw();

            // [ASSERT]
            expect(game.update).toHaveBeenCalled();
            expect(game.render).toHaveBeenCalled();
        });
    });

    describe('System Controls', () => {
        beforeEach(() => {
            game.setup();
        });

        it('should handle POWER button press', () => {
            const control = game.modules.control;
            const state = game.modules.state;

            // Simulate Power Press
            control.notify(ControlKey.POWER, ControlEventType.PRESSED);
            expect(state.isOn()).toBe(true);

            control.notify(ControlKey.POWER, ControlEventType.PRESSED);
            expect(state.isOn()).toBe(false);
        });

        it('should handle RESET button press', () => {
            const control = game.modules.control;
            const state = game.modules.state;
            const grid = game.modules.grid;

            const spy = vi.spyOn(grid, 'resetGrid');

            control.notify(ControlKey.RESET, ControlEventType.PRESSED);

            expect(spy).toHaveBeenCalled();
            expect(state.isStarted()).toBe(false);
        });
    });
});
