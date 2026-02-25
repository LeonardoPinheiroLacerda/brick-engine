import { ControlEventType, ControlKey, GameModules, StateProperty } from '../types/Types';

/**
 * Registry for system-level game events.
 * Centralizes the logic for power, reset, and state-based notifications.
 */
export default class GameEventRegistry {
    /**
     * Sets up all system-level control event subscriptions.
     *
     * @param modules - The collection of game modules.
     * @param onReset - Callback to restore the initial state of the game instance.
     */
    static setupControlEvents(modules: GameModules, onReset: () => void): void {
        const { control, state, session, sound } = modules;

        // --- System Toggles ---
        control.subscribe(ControlKey.SOUND, ControlEventType.PRESSED, () => state.toggleMuted());
        control.subscribe(ControlKey.COLOR, ControlEventType.PRESSED, () => state.toggleColorEnabled());
        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => session.clearSession());

        // --- Power ---
        control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => {
            if (state.isOn()) {
                state.turnOff();
                sound.stopAll();
            } else {
                state.turnOn();
            }
        });
        control.subscribeForGameOverScreen(ControlKey.POWER, ControlEventType.PRESSED, () => {
            this.fullReset(modules, onReset);
            state.resetGameOver();
        });

        // --- Start / Pause ---
        control.subscribeForTitleScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => state.startGame());
        control.subscribeForPlayingScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => state.pause());
        control.subscribeForGameOverScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => {
            this.fullReset(modules, onReset);
            state.resetGameOver();
        });
        control.subscribeForPausedScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => state.resume());

        // --- Reset ---
        control.subscribeForPlayingScreen(ControlKey.RESET, ControlEventType.PRESSED, () => {
            this.fullReset(modules, onReset);
            state.resetGame();
        });
        control.subscribeForPausedScreen(ControlKey.RESET, ControlEventType.PRESSED, () => {
            this.fullReset(modules, onReset);
            state.resetGame();
        });
    }

    /**
     * Sets up all system-level state property subscriptions.
     *
     * @param modules - The collection of game modules.
     */
    static setupStateEvents(modules: GameModules): void {
        const { state, session } = modules;

        state.subscribe(StateProperty.ON, isOn => {
            if (!isOn) this.resetModules(modules);
        });

        state.subscribeForGameOverScreen(StateProperty.GAME_OVER, () => {
            session.clearSession();
        });
    }

    /**
     * Resets common modules to their initial values.
     */
    private static resetModules(modules: GameModules): void {
        modules.grid.resetGrid();
        modules.score.resetScore();
        modules.score.resetLevel();
        modules.time.reset();
    }

    /**
     * Performs a full reset of modules, session, and game instance state.
     */
    private static fullReset(modules: GameModules, onReset: () => void): void {
        this.resetModules(modules);
        modules.session.clearSession();
        onReset();
    }
}
