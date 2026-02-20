/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Debugger from './Debugger';
import { GameModules } from './types/Types';

describe('Debugger', () => {
    let debug: Debugger;
    let mockModules: GameModules;

    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '';

        mockModules = {
            state: {
                getDebugData: vi.fn().mockReturnValue({ isOn: true, score: 100 }),
            },
        } as unknown as GameModules;

        debug = new Debugger(mockModules);
    });

    describe('setup', () => {
        it('should create debugger details element in DOM', () => {
            // [ACT]
            debug.setup();

            // [ASSERT]
            const details = document.getElementById('debugger');
            expect(details).not.toBeNull();
            expect(details?.tagName).toBe('DETAILS');

            const moduleDetail = document.getElementById('debugger-state');
            expect(moduleDetail).not.toBeNull();
        });
    });

    describe('update', () => {
        it('should update DOM elements with new debug data', async () => {
            // [ARRANGE]
            debug.setup();

            (mockModules.state as unknown as Record<string, import('vitest').Mock>).getDebugData.mockReturnValue({ isOn: false, score: 200 });

            // [ACT]
            vi.advanceTimersByTime(200);
            await debug.update();

            // [ASSERT]
            const scoreValue = document.getElementById('debugger-state-score-value');
            expect(scoreValue?.textContent).toBe('200');
        });
    });

    describe('destroy', () => {
        it('should remove debugger from DOM', () => {
            // [ARRANGE]
            debug.setup();
            expect(document.getElementById('debugger')).not.toBeNull();

            // [ACT]
            debug.destroy();

            // [ASSERT]
            expect(document.getElementById('debugger')).toBeNull();
        });
    });
});
