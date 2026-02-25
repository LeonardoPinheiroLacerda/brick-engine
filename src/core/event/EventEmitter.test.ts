import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventEmitter from './EventEmitter';

describe('EventEmitter', () => {
    beforeEach(() => {
        // [ARRANGE]
        EventEmitter.clear();
    });

    it('should register and notify an event', () => {
        // [ARRANGE]
        const callback = vi.fn();
        EventEmitter.subscribe('testEvent', callback);

        // [ACT]
        EventEmitter.notify('testEvent', { data: 123 });

        // [ASSERT]
        expect(callback).toHaveBeenCalledWith({ data: 123 });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple listeners for the same event', () => {
        // [ARRANGE]
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        EventEmitter.subscribe('multiEvent', callback1);
        EventEmitter.subscribe('multiEvent', callback2);

        // [ACT]
        EventEmitter.notify('multiEvent');

        // [ASSERT]
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should unregister an event listener', () => {
        // [ARRANGE]
        const callback = vi.fn();
        EventEmitter.subscribe('testEvent', callback);

        // [ACT]
        EventEmitter.unsubscribe('testEvent', callback);
        EventEmitter.notify('testEvent');

        // [ASSERT]
        expect(callback).not.toHaveBeenCalled();
    });

    it('should safely notify when no listeners are registered', () => {
        // [ACT] & [ASSERT]
        expect(() => {
            EventEmitter.notify('unregisteredEvent');
        }).not.toThrow();
    });

    it('should safely unsubscribe when no listeners are registered', () => {
        // [ARRANGE]
        const callback = vi.fn();

        // [ACT] & [ASSERT]
        expect(() => {
            EventEmitter.unsubscribe('unregisteredEvent', callback);
        }).not.toThrow();
    });

    it('should clear all events', () => {
        // [ARRANGE]
        const callback = vi.fn();
        EventEmitter.subscribe('testEvent', callback);

        // [ACT]
        EventEmitter.clear();
        EventEmitter.notify('testEvent');

        // [ASSERT]
        expect(callback).not.toHaveBeenCalled();
    });
});
