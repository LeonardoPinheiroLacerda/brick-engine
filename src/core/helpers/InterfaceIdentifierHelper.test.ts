import { describe, it, expect } from 'vitest';
import InterfaceIdentifierHelper from './InterfaceIdentifierHelper';
import GameState from '../module/state/GameState';

describe('InterfaceIdentifierHelper', () => {
    describe('isSerializable', () => {
        it('should return true when object has serialize, deserialize and serialId', () => {
            // [ARRANGE]
            const validModule = {
                serialize: () => '{}',
                deserialize: () => {},
                serialId: 'test-id',
            };

            // [ACT]
            const result = InterfaceIdentifierHelper.isSerializable(validModule);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false when object is missing required methods or properties', () => {
            // [ARRANGE]
            const invalidModule = { serialize: () => '{}' };

            // [ACT]
            const result = InterfaceIdentifierHelper.isSerializable(invalidModule);

            // [ASSERT]
            expect(result).toBe(false);
        });

        it('should return false when object is null or undefined', () => {
            // [ACT] & [ASSERT]
            expect(InterfaceIdentifierHelper.isSerializable(null as unknown as object)).toBe(false);
            expect(InterfaceIdentifierHelper.isSerializable(undefined as unknown as object)).toBe(false);
        });
    });

    describe('isInitializable', () => {
        it('should return true when object has a setup function', () => {
            // [ARRANGE]
            const validModule = { setup: () => {} };

            // [ACT]
            const result = InterfaceIdentifierHelper.isInitializable(validModule);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false when object lacks a setup function', () => {
            // [ARRANGE]
            const invalidModule = { otherMethod: () => {} };

            // [ACT]
            const result = InterfaceIdentifierHelper.isInitializable(invalidModule);

            // [ASSERT]
            expect(result).toBe(false);
        });
    });

    describe('isStateSyncable', () => {
        it('should return true when object has syncState and is NOT GameState', () => {
            // [ARRANGE]
            const validModule = { syncState: () => {} };

            // [ACT]
            const result = InterfaceIdentifierHelper.isStateSyncable(validModule);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false when object is an instance of GameState', () => {
            // [ARRANGE]
            const gameStateInstance = new GameState();

            // [ACT]
            const result = InterfaceIdentifierHelper.isStateSyncable(gameStateInstance);

            // [ASSERT]
            expect(result).toBe(false);
        });

        it('should return false when object lacks syncState method', () => {
            // [ARRANGE]
            const invalidModule = { otherMethod: () => {} };

            // [ACT]
            const result = InterfaceIdentifierHelper.isStateSyncable(invalidModule);

            // [ASSERT]
            expect(result).toBe(false);
        });
    });

    describe('isDebuggable', () => {
        it('should return true when object has getDebugData function', () => {
            // [ARRANGE]
            const validModule = { getDebugData: () => ({}) };

            // [ACT]
            const result = InterfaceIdentifierHelper.isDebuggable(validModule);

            // [ASSERT]
            expect(result).toBe(true);
        });

        it('should return false when object lacks getDebugData function', () => {
            // [ARRANGE]
            const invalidModule = { otherMethod: () => {} };

            // [ACT]
            const result = InterfaceIdentifierHelper.isDebuggable(invalidModule);

            // [ASSERT]
            expect(result).toBe(false);
        });
    });
});
