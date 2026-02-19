import GameMenu from './GameMenu';

export default class GameMenuSingleton {
    private static _instance: GameMenu;

    static setInstance(instance: GameMenu) {
        GameMenuSingleton._instance = instance;
    }

    static getInstance(): GameMenu {
        return GameMenuSingleton._instance;
    }
}
