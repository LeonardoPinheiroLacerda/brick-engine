/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import p5 from 'p5';
import Game from './core/Game';

// Mocking everything before importing main.ts logic
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

vi.mock('./menu/GameMenu', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return mockGame;
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

vi.mock('./menu/GameMenuSingleton', () => ({
    default: {
        setInstance: vi.fn(),
        getInstance: vi.fn().mockReturnValue(mockGame),
    },
}));

vi.mock('./config/styles', () => ({}));

describe('main.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should initialize the p5 instance and GameMenu in server mode', async () => {
        const { isClientMode, isServerMode } = await import('./config/env');
        const GameMenu = (await import('./menu/GameMenu')).default;

        (isClientMode as unknown as Mock).mockReturnValue(false);
        (isServerMode as unknown as Mock).mockReturnValue(true);

        const main = await import('./main');

        expect(p5).toHaveBeenCalled();
        expect(GameMenu).toHaveBeenCalled();
        expect(main.p5Instance).toBeDefined();
    });

    it('should initialize ClientGame in client mode', async () => {
        const { isClientMode, isServerMode } = await import('./config/env');
        const ClientGame = (await import('@client-game')).default;

        (isClientMode as unknown as Mock).mockReturnValue(true);
        (isServerMode as unknown as Mock).mockReturnValue(false);

        await import('./main');

        expect(ClientGame).toHaveBeenCalled();
    });

    it('should handle game switching', async () => {
        const { isClientMode, isServerMode } = await import('./config/env');
        (isClientMode as unknown as Mock).mockReturnValue(false);
        (isServerMode as unknown as Mock).mockReturnValue(true);

        await import('./main');

        const switchHandler = (mockGame.setSwitchHandler as unknown as Mock).mock.calls[0][0];
        const nextGame = createMockGame();

        switchHandler(nextGame as unknown as Game);

        expect(nextGame.setup).toHaveBeenCalled();
        expect(nextGame.modules.state.turnOn).toHaveBeenCalled();
    });
});
