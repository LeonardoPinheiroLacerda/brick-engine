/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocking everything before importing main.ts logic
/**
 * Creates a mock game object with all necessary modules and view methods.
 *
 * @returns {any} A mock game object for testing purposes.
 */
const createMockGame = () => ({
    setup: vi.fn(),
    setSwitchHandler: vi.fn(),
    propagateSwitchHandler: vi.fn(),
    draw: vi.fn(),
    modules: {
        state: { turnOn: vi.fn(), turnOff: vi.fn(), isOn: vi.fn() },
        control: { subscribe: vi.fn() },
        time: { update: vi.fn() },
    },
    view: {
        unbindControls: vi.fn(),
        bindControls: vi.fn(),
        updateDebuggerGameModules: vi.fn(),
        setupDebugger: vi.fn(),
    },
});

const mockGame = createMockGame();

vi.mock('p5', () => {
    return {
        default: vi.fn().mockImplementation(function (sketch: (p: unknown) => void) {
            const p = {
                loop: vi.fn(),
                noLoop: vi.fn(),
                setup: vi.fn(),
                draw: vi.fn(),
            };
            sketch(p);
            return p;
        }),
    };
});

vi.mock('./view/GameView', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                build: vi.fn().mockReturnValue({ canvas: {}, canvasHeight: 100, canvasWidth: 100 }),
                bindControls: vi.fn(),
                unbindControls: vi.fn(),
                setupDebugger: vi.fn(),
                updateDebuggerGameModules: vi.fn(),
            };
        }),
    };
});

vi.mock('./core/Debugger', () => ({
    default: vi.fn().mockImplementation(function () {
        return { setup: vi.fn(), update: vi.fn(), destroy: vi.fn() };
    }),
}));

vi.mock('./config/env', () => ({
    isClientMode: vi.fn(),
    isServerMode: vi.fn(),
}));

vi.mock('@client-game', () => ({
    default: vi.fn().mockImplementation(function () {
        return mockGame;
    }),
}));

describe('main.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should initialize ClientGame', async () => {
        const ClientGame = (await import('@client-game')).default;

        const { bootstrap } = await import('./bootstrap');
        bootstrap(ClientGame);

        expect(ClientGame).toHaveBeenCalled();
    });
});
