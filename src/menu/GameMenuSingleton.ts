import GameMenu from './GameMenu';

/**
 * Singleton manager for the Game Menu instance.
 *
 * This class provides a centralized point to store and retrieve the Game Menu
 * instance, facilitating access for game switching and system-level actions.
 */
export default class GameMenuSingleton {
    private static _instance: GameMenu;

    /**
     * Sets the global instance of the Game Menu.
     *
     * @param {GameMenu} instance - The Game Menu instance.
     * @returns {void}
     */
    static setInstance(instance: GameMenu) {
        GameMenuSingleton._instance = instance;
    }

    /**
     * Retrieves the global instance of the Game Menu.
     *
     * @returns {GameMenu} The Game Menu instance.
     */
    static getInstance(): GameMenu {
        return GameMenuSingleton._instance;
    }

    /**
     * Checks if the Game Menu instance has been initialized.
     *
     * @returns {boolean} True if the instance exists, false otherwise.
     */
    static hasInstance(): boolean {
        return GameMenuSingleton._instance !== undefined;
    }
}
