import { Serializable } from '../../types/Interfaces';
import { StateProperty } from '../../types/enums';
import { Session, State } from '../../types/modules';

export default class GameSession implements Session {
    _state: State;
    gameId: string;

    private _isSessionResolved: boolean = false;
    private _isModalOpen: boolean = false;
    private _isEnabled: boolean = true;
    private _showSessionModal: (onConfirm: () => void, onCancel: () => void) => void;
    private _serializables: Serializable[] = [];

    register(serializable: Serializable): void {
        this._serializables.push(serializable);
    }

    saveSession(): void {
        if (!this._isSessionResolved || !this._isEnabled) return;

        this._serializables.forEach(serializable => {
            localStorage.setItem(this._key(serializable.serialId), serializable.serialize());
        });
    }

    clearSession(): void {
        this._serializables.forEach(serializable => {
            localStorage.removeItem(this._key(serializable.serialId));
        });
    }

    setShowModalFunction(showModal: (onConfirm: () => void, onCancel: () => void) => void): void {
        this._showSessionModal = showModal;
    }

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
                        this._isModalOpen = false;
                        this._isSessionResolved = true;
                    },
                );
            }
        });

        state.subscribe(StateProperty.ON, isOn => {
            if (!isOn) {
                this._isSessionResolved = false;
                this._isModalOpen = false;
            }
        });
    }

    getDebugData(): Record<string, string | number | boolean> {
        return {
            gameId: this.gameId,
            serializables: this._serializables.map(serializable => serializable.serialId).join(', '),
        };
    }

    private _key(key: string): string {
        return `${this.gameId}::${key}`;
    }
}
