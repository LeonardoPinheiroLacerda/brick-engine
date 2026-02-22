import { Serializable } from '../../types/Interfaces';
import { StateProperty } from '../../types/enums';
import { Session, State } from '../../types/modules';

export default class GameSession implements Session {
    _state: State;
    gameId: string;

    private _isModalClosed: boolean = false;
    private _showSessionModal: (onConfirm: () => void, onCancel: () => void) => void;
    private _serializables: Serializable[] = [];

    register(serializable: Serializable): void {
        this._serializables.push(serializable);
    }

    saveSession(): void {
        if (!this._isModalClosed || this._isGameMenuInstance()) return;

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

    private _isGameMenuInstance(): boolean {
        return this.gameId === 'game-menu';
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
    private _destroySession(): void {
        this._serializables.forEach(serializable => {
            localStorage.removeItem(this._key(serializable.serialId));
        });
    }

    syncState(state: State): void {
        state.subscribe(StateProperty.PLAYING, isPlaying => {
            if (isPlaying) {
                if (!this._hasSession() || this._isGameMenuInstance()) {
                    this._isModalClosed = true;
                    return;
                }

                this._showSessionModal(
                    () => {
                        if (this._hasSession() && !this._isGameMenuInstance()) {
                            this._loadSession();
                        }
                        this._isModalClosed = true;
                    },
                    () => {
                        this._destroySession();
                        this._isModalClosed = true;
                    },
                );
            }
        });

        state.subscribe(StateProperty.GAME_OVER, isGameOver => {
            if (isGameOver) {
                this._destroySession();
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
