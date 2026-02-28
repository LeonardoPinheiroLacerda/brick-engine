import { Serializable } from '../../types/Interfaces';
import { StateProperty } from '../../types/enums';
import { Session, State } from '../../types/modules';

/**
 * Core module orchestrating state synchronization and transient game data persistence.
 *
 * Implements the {@link Session} interface to establish a single secure boundary
 * between the active engine states and physical local storage limits. It intercepts
 * the startup engine flows to ensure all registered {@link Serializable} modules
 * correctly pause initialization safely inside a modal window until a human resolves
 * the conflict (restoring or clearing).
 */
export default class GameSession implements Session {
    _state: State;
    gameId: string;

    private _isSessionResolved: boolean = false;
    private _isModalOpen: boolean = false;
    private _isEnabled: boolean = true;
    private _showSessionModal: (onConfirm: () => void, onCancel: () => void) => void;
    private _resetFn: () => void = () => {};
    private _serializables: Serializable[] = [];

    /**
     * Registers an external module to be actively tracked and persisted during session events.
     *
     * @param {Serializable} serializable - The compliant module instance exposing standard serialization capabilities.
     * @returns {void} Returns nothing.
     */
    register(serializable: Serializable): void {
        this._serializables.push(serializable);
    }

    /**
     * Extracts and physically persists the current state payload of all registered modules to browser storage.
     * Silently aborts if the session has not completed the restoration resolution flow or is disabled.
     *
     * @returns {void} Returns nothing.
     */
    saveSession(): void {
        if (!this._isSessionResolved || !this._isEnabled) return;

        this._serializables.forEach(serializable => {
            localStorage.setItem(this._key(serializable.serialId), serializable.serialize());
        });
    }

    /**
     * Irreversibly wipes all transient saved module data mapped under this session's namespace.
     *
     * @returns {void} Returns nothing.
     */
    clearSession(): void {
        this._serializables.forEach(serializable => {
            localStorage.removeItem(this._key(serializable.serialId));
        });
    }

    /**
     * Injects the visual modal resolution closure implemented upstream.
     *
     * @param {Function} showModal - The asynchronous UI closure designed to ask the player to reload or reset the session.
     * @returns {void} Returns nothing.
     */
    setShowModalFunction(showModal: (onConfirm: () => void, onCancel: () => void) => void): void {
        this._showSessionModal = showModal;
    }

    /**
     * Injects the explicit game restoration sequence to execute when a session is aborted.
     *
     * @param {Function} resetFn - The recovery routine triggering a clean slate reset.
     * @returns {void} Returns nothing.
     */
    setResetFunction(resetFn: () => void): void {
        this._resetFn = resetFn;
    }

    /**
     * Hard-toggles whether the session recovery mechanism evaluates at startup.
     *
     * @param {boolean} enabled - True to enforce session monitoring, false to skip entirely.
     * @returns {void} Returns nothing.
     */
    setSessionEnabled(enabled: boolean): void {
        this._isEnabled = enabled;
    }

    isModalOpen(): boolean {
        return this._isModalOpen;
    }

    isSessionResolved(): boolean {
        return this._isSessionResolved;
    }

    private _hasSession(): boolean {
        return this._serializables.every(serializable => localStorage.getItem(this._key(serializable.serialId)) !== null);
    }

    private _loadSession(): void {
        this._serializables.forEach(serializable => {
            const data = localStorage.getItem(this._key(serializable.serialId));
            if (data) {
                serializable.deserialize(data);
            }
        });
    }

    /**
     * Hooks into the global single source of truth state listener.
     * Triggers the UI recovery workflow explicitly when the engine switches to the PLAYING state.
     *
     * @param {State} state - The authoritative lifecycle hub object to observe securely.
     * @returns {void} Returns nothing.
     */
    syncState(state: State): void {
        state.subscribe(StateProperty.PLAYING, isPlaying => {
            if (isPlaying && !this._isSessionResolved) {
                if (!this._hasSession() || !this._isEnabled) {
                    this._isSessionResolved = true;
                    return;
                }

                this._isModalOpen = true;
                this._showSessionModal(
                    () => {
                        this._loadSession();
                        this._isModalOpen = false;
                        this._isSessionResolved = true;
                    },
                    () => {
                        this.clearSession();
                        this._resetFn();
                        this._isModalOpen = false;
                        this._isSessionResolved = true;
                    },
                );
            }
        });

        state.subscribe(StateProperty.ON, isOn => {
            if (!isOn) {
                this._isModalOpen = false;
                this._isSessionResolved = false;
            }
        });

        state.subscribe(StateProperty.START, isStarted => {
            if (!isStarted) {
                this._isSessionResolved = false;
            }
        });
    }

    /**
     * Aggregates live metadata properties intended strictly for Development Dashboards.
     *
     * @returns {Record<string, string | number | boolean>} A shallow payload of the session tracker statuses.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            game_id: this.gameId,
            is_session_resolved: this._isSessionResolved,
            is_modal_open: this._isModalOpen,
            is_enabled: this._isEnabled,
            serializables: this._serializables.map(serializable => serializable.serialId).join(', '),
        };
    }

    private _key(key: string): string {
        return `${this.gameId}::${key}`;
    }
}
