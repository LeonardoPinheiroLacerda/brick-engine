import { describe, it, expect } from 'vitest';
import GameMenuSingleton from './GameMenuSingleton';
import GameMenu from './GameMenu';

describe('GameMenuSingleton', () => {
    it('should store and retrieve a GameMenu instance', () => {
        const mockInstance = { name: 'MockGameMenu' } as unknown as GameMenu;

        GameMenuSingleton.setInstance(mockInstance);
        const retrieved = GameMenuSingleton.getInstance();

        expect(retrieved).toBe(mockInstance);
        expect((retrieved as unknown as { name: string }).name).toBe('MockGameMenu');
    });

    it('should overwrite the previous instance when setInstance is called again', () => {
        const mockInstance1 = { id: 1 } as unknown as GameMenu;
        const mockInstance2 = { id: 2 } as unknown as GameMenu;

        GameMenuSingleton.setInstance(mockInstance1);
        expect(GameMenuSingleton.getInstance()).toBe(mockInstance1);

        GameMenuSingleton.setInstance(mockInstance2);
        expect(GameMenuSingleton.getInstance()).toBe(mockInstance2);
    });
});
