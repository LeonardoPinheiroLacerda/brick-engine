import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameState from './GameState';
import { StateProperty } from '../../types/Types';

describe('GameState', () => {
    let state: GameState;

    beforeEach(() => {
        // [ARRANGE] Mock localStorage
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue(null),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });

        state = new GameState();
    });

    describe('setup', () => {
        it('should initialize with default values and load from localStorage', () => {
            // [ARRANGE] Mock stored High Score
            vi.mocked(localStorage.getItem).mockImplementation(key => {
                if (key === 'GAME.SCORE') return '500';
                return null;
            });

            // [ACT]
            state.setup();

            // [ASSERT]
            expect(state.isOn()).toBe(false);
            expect(state.isColorEnabled()).toBe(true);
            expect(state.getHighScore()).toBe(500);
        });
    });

    describe('State Transitions', () => {
        beforeEach(() => {
            state.setup();
        });

        it('should change ON state and notify subscribers', () => {
            // [ARRANGE]
            const callback = vi.fn();
            state.subscribe(StateProperty.ON, callback);

            // [ACT]
            state.turnOn();

            // [ASSERT]
            expect(state.isOn()).toBe(true);
            expect(callback).toHaveBeenCalledWith(true);
        });

        it('should not allow starting game if machine is off', () => {
            // [ACT]
            state.startGame();

            // [ASSERT]
            expect(state.isStarted()).toBe(false);
        });

        it('should allow starting game if machine is on', () => {
            // [ARRANGE]
            state.turnOn();

            // [ACT]
            state.startGame();

            // [ASSERT]
            expect(state.isStarted()).toBe(true);
            expect(state.isPlaying()).toBe(true);
        });

        it('should handle pause and resume', () => {
            // [ARRANGE]
            state.turnOn();
            state.startGame();
            expect(state.isPlaying()).toBe(true);

            // [ACT - Pause]
            state.pause();
            // [ASSERT]
            expect(state.isPlaying()).toBe(false);
            expect(state.isPaused()).toBe(true);

            // [ACT - Resume]
            state.resume();
            // [ASSERT]
            expect(state.isPlaying()).toBe(true);
            expect(state.isPaused()).toBe(false);
        });
    });

    describe('Persistence', () => {
        it('should save to localStorage when a persisted property changes', () => {
            // [ARRANGE]
            state.setup();
            state.setPersistenceKey('MY_APP');

            // [ACT]
            state.setHighScore(1000);

            // [ASSERT]
            expect(localStorage.setItem).toHaveBeenCalledWith('MY_APP.GAME.SCORE', '1000');
        });
    });
});
