import { ControlEventType, ControlKey, GameModules, StateProperty } from '../types/Types';
import type GameView from '../../view/GameView';

/**
 * Registry for system-level game events.
 *
 * Centralizes the logic for power, reset, and state-based notifications.
 * By moving these registrations out of the core Game class, it maintains
 * a clean startup sequence and ensures that all modules remain decoupled
 * while still reacting to global lifecycle changes like turning on/off or Game Over.
 */
export default class GameEventRegistry {
    /**
     * Sets up all system-level control event subscriptions.
     *
     * Injects handlers for core game hardware button mappings like power cycling,
     * resetting the active game, unpausing, or modifying hardware toggles like
     * sound and color.
     *
     * @param {GameModules} modules - The collection of initialized game modules to bind.
     * @param {() => void} onReset - Callback to be executed immediately to restore the initial properties of the game instance during soft resets.
     * @returns {void} Returns nothing.
     */
    static setupControlEvents(modules: GameModules, onReset: () => void): void {
        const { control, state, session, sound } = modules;

        // --- System Toggles ---
        control.subscribe(ControlKey.SOUND, ControlEventType.PRESSED, () => state.toggleMuted());
        control.subscribe(ControlKey.COLOR, ControlEventType.PRESSED, () => state.toggleColorEnabled());
        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => session.clearSession());
        control.subscribe(ControlKey.TRACKPAD, ControlEventType.PRESSED, () => state.toggleTrackpadEnabled());

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
            onReset();
            state.resetGameOver();
        });

        // --- Start / Pause ---
        control.subscribeForTitleScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => state.startGame());
        control.subscribeForPlayingScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => state.pause());
        control.subscribeForGameOverScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => {
            onReset();
            state.resetGameOver();
        });
        control.subscribeForPausedScreen(ControlKey.START_PAUSE, ControlEventType.PRESSED, () => state.resume());

        // --- Reset ---
        control.subscribeForPlayingScreen(ControlKey.RESET, ControlEventType.PRESSED, () => {
            onReset();
            state.resetGame();
        });
        control.subscribeForPausedScreen(ControlKey.RESET, ControlEventType.PRESSED, () => {
            onReset();
            state.resetGame();
        });
    }

    /**
     * Sets up all system-level state property subscriptions.
     *
     * Binds lifecycle behaviors to state property changes, such as clearing
     * current session data upon encountering Game Over, or fully purging
     * rendering/grid variables when the system is virtually powered down.
     *
     * @param {GameModules} modules - The structured collection of engine modules.
     * @param {GameView} view - The active game view to notify about visual state changes.
     * @returns {void} Returns nothing.
     */
    static setupStateEvents(modules: GameModules, view: GameView): void {
        const { state, session } = modules;

        state.subscribe(StateProperty.ON, isOn => {
            if (!isOn) {
                modules.grid.resetGrid();
                modules.score.resetScore();
                modules.score.resetLevel();
                modules.time.reset();
            }
        });

        state.subscribeForGameOverScreen(StateProperty.GAME_OVER, () => {
            session.clearSession();
        });

        state.subscribe(StateProperty.TRACKPAD, (enabled: boolean) => {
            view.applyTrackpadState(enabled);
        });
        view.applyTrackpadState(state.isTrackpadEnabled());
    }
}
