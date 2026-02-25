import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import GameSession from './GameSession';
import { State } from '../../types/modules';
import { Serializable } from '../../types/Interfaces';
import { StateProperty } from '../../types/enums';

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('GameSession', () => {
    let session: GameSession;
    let mockState: State;
    let mockSerializable: Serializable;
    let showModalMock: Mock;
    let stateSubscriptions: Record<string, (val: boolean) => void>;

    beforeEach(() => {
        // [ARRANGE]
        localStorageMock.clear();
        vi.clearAllMocks();

        stateSubscriptions = {};
        mockState = {
            subscribe: vi.fn((property: StateProperty, callback: (val: boolean) => void) => {
                stateSubscriptions[property] = callback;
            }),
        } as unknown as State;

        mockSerializable = {
            serialId: 'test-serial',
            serialize: vi.fn().mockReturnValue('serialized-data'),
            deserialize: vi.fn(),
        } as unknown as Serializable;

        showModalMock = vi.fn();

        session = new GameSession();
        session.gameId = 'test-game';
        session.setShowModalFunction(showModalMock);
        session.register(mockSerializable);
    });

    describe('saveSession', () => {
        it('should return early and not save if session is not resolved', () => {
            // [ACT]
            session.saveSession();

            // [ASSERT]
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
        });

        it('should return early and not save if session is disabled', () => {
            // [ARRANGE]
            session.setSessionEnabled(false);
            session.syncState(mockState);
            // Simulate playing state -> resolves session immediately when disabled
            stateSubscriptions[StateProperty.PLAYING]?.(true);

            // [ACT]
            session.saveSession();

            // [ASSERT]
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
        });

        it('should save session when resolved and session is enabled', () => {
            // [ARRANGE]
            session.syncState(mockState);
            // Resolve session automatically since no session exists
            stateSubscriptions[StateProperty.PLAYING]?.(true);

            // [ACT]
            session.saveSession();

            // [ASSERT]
            expect(localStorageMock.setItem).toHaveBeenCalledWith('test-game::test-serial', 'serialized-data');
        });
    });

    describe('syncState', () => {
        it('should not show modal and resolve session when there is no session', () => {
            // [ARRANGE]
            session.syncState(mockState);

            // [ACT]
            stateSubscriptions[StateProperty.PLAYING]?.(true);

            // [ASSERT]
            expect(showModalMock).not.toHaveBeenCalled();
            // Verify session is resolved by saving
            session.saveSession();
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('should not show modal when session is disabled', () => {
            // [ARRANGE]
            session.setSessionEnabled(false);
            // Simulate existing session
            localStorageMock.setItem('test-game::test-serial', 'some-data');
            session.syncState(mockState);

            // [ACT]
            stateSubscriptions[StateProperty.PLAYING]?.(true);

            // [ASSERT]
            expect(showModalMock).not.toHaveBeenCalled();
        });

        it('should show session modal and report open when playing, has session, and is enabled', () => {
            // [ARRANGE]
            localStorageMock.setItem('test-game::test-serial', 'some-data');
            session.syncState(mockState);

            // [ACT]
            stateSubscriptions[StateProperty.PLAYING]?.(true);

            // [ASSERT]
            expect(showModalMock).toHaveBeenCalledTimes(1);
            expect(session.isModalOpen()).toBe(true);
        });

        it('should load session, close modal, and resolve when confirmed', () => {
            // [ARRANGE]
            localStorageMock.setItem('test-game::test-serial', 'some-data');
            session.syncState(mockState);
            stateSubscriptions[StateProperty.PLAYING]?.(true);
            const onConfirm = showModalMock.mock.calls[0][0] as () => void;

            // [ACT]
            onConfirm();

            // [ASSERT]
            expect(mockSerializable.deserialize).toHaveBeenCalledWith('some-data');
            expect(session.isModalOpen()).toBe(false);

            // Should be able to save now
            session.saveSession();
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('should destroy session, close modal, and resolve when canceled', () => {
            // [ARRANGE]
            localStorageMock.setItem('test-game::test-serial', 'some-data');
            session.syncState(mockState);
            stateSubscriptions[StateProperty.PLAYING]?.(true);
            const onCancel = showModalMock.mock.calls[0][1] as () => void;

            // [ACT]
            onCancel();

            // [ASSERT]
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-game::test-serial');
            expect(session.isModalOpen()).toBe(false);

            // Should be able to save now
            session.saveSession();
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });
    });
});
