import { describe, it, expect, vi } from 'vitest';
import InitialStateSnapshot from './InitialStateSnapshot';

describe('InitialStateSnapshot', () => {
    it('should ignore base properties and capture custom client properties using structuredClone', () => {
        // [ARRANGE]
        const snapshot = new InitialStateSnapshot();
        const instance: Record<string, unknown> = {
            _baseProp: 'base',
            setupGame: () => {},
        };

        // [ACT]
        snapshot.captureBaseProperties(instance);
        instance.customNumber = 42;
        instance.customArray = [1, 2, 3];
        snapshot.captureInitialState(instance);

        instance.customNumber = 100;
        (instance.customArray as number[]).push(4);

        snapshot.restoreInitialState(instance);

        expect(instance.customNumber).toBe(42);
        expect(instance.customArray).toEqual([1, 2, 3]);
        expect(instance._baseProp).toBe('base');
    });

    it('should use a custom .clone() method if available', () => {
        const snapshot = new InitialStateSnapshot();
        const originalObject = {
            data: 10,
            clone: function () {
                return { ...this };
            },
        };

        const instance: Record<string, unknown> = { _base: true };
        snapshot.captureBaseProperties(instance);
        instance.customClone = originalObject;

        snapshot.captureInitialState(instance);

        originalObject.data = 99; // mutate original

        snapshot.restoreInitialState(instance);

        expect((instance.customClone as { data: number }).data).toBe(10);
    });

    it('should use a custom .copy() method if available', () => {
        const snapshot = new InitialStateSnapshot();
        const originalObject = {
            data: 20,
            copy: function () {
                return { ...this };
            },
        };

        const instance: Record<string, unknown> = { _base: true };
        snapshot.captureBaseProperties(instance);
        instance.customCopy = originalObject;

        snapshot.captureInitialState(instance);

        originalObject.data = 88; // mutate original

        snapshot.restoreInitialState(instance);

        expect((instance.customCopy as { data: number }).data).toBe(20);
    });

    it('should fallback to reference if structuredClone fails', () => {
        // [ARRANGE]
        const snapshot = new InitialStateSnapshot();
        const instance: Record<string, unknown> = { _base: true };
        snapshot.captureBaseProperties(instance);

        // Object containing a function throws DataCloneError in structuredClone
        const uncloneableObj: Record<string, unknown> = { func: () => {} };
        instance.uncloneable = uncloneableObj;

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // [ACT]
        snapshot.captureInitialState(instance);

        // [ASSERT]
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Failed to clone property 'uncloneable' (value: [object Object]). Saving reference instead."),
            expect.any(Error),
        );

        // Cleanup spy
        consoleSpy.mockRestore();
    });
});
