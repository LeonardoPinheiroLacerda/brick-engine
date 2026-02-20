/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GameManager from './GameManager';
import Game from '../../core/Game';
import p5 from 'p5';

describe('GameManager', () => {
    let manager: GameManager;
    let mockGame: Record<string, unknown>;

    beforeEach(() => {
        document.head.innerHTML = '';
        manager = new GameManager();
        mockGame = {
            p: {} as p5,
            view: {},
            switchGame: vi.fn(),
        };
    });

    afterEach(() => {
        delete (window as unknown as Record<string, unknown>).BrickEngineGame;
    });

    it('should load script and switch game', async () => {
        // [ARRANGE]
        const entry = { name: 'TestGame', url: 'http://example.com/test.js' };

        // Mocking script loading behavior
        const appendSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(((el: HTMLScriptElement) => {
            // Simulate script load success
            setTimeout(() => {
                (window as unknown as Record<string, unknown>).BrickEngineGame = vi.fn().mockImplementation(function () {
                    return {};
                });
                if (el.onload) el.onload(new Event('load'));
            }, 0);
            return el;
        }) as unknown as <T extends Node>(node: T) => T);

        // [ACT]
        await manager.handleGameSwitch(entry, mockGame as unknown as Game);

        // [ASSERT]
        expect(appendSpy).toHaveBeenCalled();
        expect(mockGame.switchGame).toHaveBeenCalled();
        expect((window as unknown as Record<string, unknown>).BrickEngineGame).toBeUndefined(); // Should be deleted after switch
    });

    it('should handle script load failure', async () => {
        // [ARRANGE]
        const entry = { name: 'FailGame', url: 'http://example.com/fail.js' };
        vi.spyOn(document.head, 'appendChild').mockImplementation(((el: HTMLScriptElement) => {
            setTimeout(() => {
                if (el.onerror) el.onerror(new Event('error'));
            }, 0);
            return el;
        }) as unknown as <T extends Node>(node: T) => T);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // [ACT]
        await manager.handleGameSwitch(entry, mockGame as unknown as Game);

        // [ASSERT]
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load game:', expect.any(Error));
    });
});
