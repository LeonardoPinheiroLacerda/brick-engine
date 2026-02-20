import { Serializable, SessionManager } from '../../types/interfaces';

export default class LocalStorageSessionManager implements SessionManager {
    private generateKey(serializable: Serializable, key: string): string {
        return `${key}::${serializable.serialId}`;
    }

    hasSession(serializable: Serializable, key: string): boolean {
        return localStorage.getItem(this.generateKey(serializable, key)) !== null;
    }

    saveSession(serializable: Serializable, key: string): void {
        localStorage.setItem(this.generateKey(serializable, key), serializable.serialize());
    }

    loadSession(serializable: Serializable, key: string): boolean {
        const data = localStorage.getItem(this.generateKey(serializable, key));
        if (data) {
            serializable.deserialize(data);
            return true;
        }
        return false;
    }

    clearSession(serializable: Serializable, key: string): void {
        localStorage.removeItem(this.generateKey(serializable, key));
    }
}
