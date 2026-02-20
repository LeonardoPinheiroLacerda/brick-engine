import { describe, it, expect, vi, beforeEach } from 'vitest';
import LocalStorageSessionManager from './LocalStorageSessionManager';
import { Serializable } from '../../types/interfaces';

describe('LocalStorageSessionManager', () => {
    let sessionManager: LocalStorageSessionManager;
    let mockSerializable: Serializable;
    const testKey = 'test-game';

    beforeEach(() => {
        sessionManager = new LocalStorageSessionManager();
        mockSerializable = {
            serialId: 'test-module',
            serialize: vi.fn().mockReturnValue('{"data": "mock"}'),
            deserialize: vi.fn(),
        };

        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        });
    });

    describe('hasSession', () => {
        it('should return true when session data exists in localStorage', () => {
            // [ARRANGE]
            vi.mocked(localStorage.getItem).mockReturnValue('{"data": "mock"}');

            // [ACT]
            const result = sessionManager.hasSession(mockSerializable, testKey);

            // [ASSERT]
            expect(localStorage.getItem).toHaveBeenCalledWith(`${testKey}::test-module`);
            expect(result).toBe(true);
        });

        it('should return false when session data does NOT exist in localStorage', () => {
            // [ARRANGE]
            vi.mocked(localStorage.getItem).mockReturnValue(null);

            // [ACT]
            const result = sessionManager.hasSession(mockSerializable, testKey);

            // [ASSERT]
            expect(result).toBe(false);
        });
    });

    describe('saveSession', () => {
        it('should save serialized string to localStorage under the correct key', () => {
            // [ACT]
            sessionManager.saveSession(mockSerializable, testKey);

            // [ASSERT]
            expect(mockSerializable.serialize).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalledWith(`${testKey}::test-module`, '{"data": "mock"}');
        });
    });

    describe('loadSession', () => {
        it('should call deserialize with parsed data and return true if session is found', () => {
            // [ARRANGE]
            const mockData = '{"saved": true}';
            vi.mocked(localStorage.getItem).mockReturnValue(mockData);

            // [ACT]
            const result = sessionManager.loadSession(mockSerializable, testKey);

            // [ASSERT]
            expect(mockSerializable.deserialize).toHaveBeenCalledWith(mockData);
            expect(result).toBe(true);
        });

        it('should return false and not call deserialize if session is NOT found', () => {
            // [ARRANGE]
            vi.mocked(localStorage.getItem).mockReturnValue(null);

            // [ACT]
            const result = sessionManager.loadSession(mockSerializable, testKey);

            // [ASSERT]
            expect(mockSerializable.deserialize).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('clearSession', () => {
        it('should remove the key from localStorage', () => {
            // [ACT]
            sessionManager.clearSession(mockSerializable, testKey);

            // [ASSERT]
            expect(localStorage.removeItem).toHaveBeenCalledWith(`${testKey}::test-module`);
        });
    });
});
