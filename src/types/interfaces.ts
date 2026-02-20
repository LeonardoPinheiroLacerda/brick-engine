export interface GameEntry {
    name: string;
    url: string;
}

export interface Serializable {
    serialId: string;
    serialize(): string;
    deserialize(data: string): void;
}

export interface SessionManager {
    saveSession(serializable: Serializable, key: string): void;
    loadSession(serializable: Serializable, key: string): boolean;
    hasSession(serializable: Serializable, key: string): boolean;
    clearSession(serializable: Serializable, key: string): void;
}
