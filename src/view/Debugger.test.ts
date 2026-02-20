/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import Debugger from './Debugger';
import type p5 from 'p5';
import configs from '../config/configs';
import { GameModules } from '../core/types/Types';

// Mock configs
vi.mock('../config/configs', () => ({
    default: {
        game: {
            debugger: {
                enabled: true,
                msInterval: 1000,
            },
        },
    },
}));

describe('Debugger', () => {
    let mockP5: Record<string, Mock>;
    let mockGameModules: Record<string, unknown>;
    let debuggerInstance: Debugger;

    beforeEach(() => {
        // [ARRANGE]
        mockP5 = {
            createElement: vi.fn().mockImplementation(() => ({
                id: vi.fn().mockReturnThis(),
                parent: vi.fn().mockReturnThis(),
                class: vi.fn().mockReturnThis(),
                html: vi.fn().mockReturnThis(),
                attribute: vi.fn().mockReturnThis(),
                mouseClicked: vi.fn().mockReturnThis(),
                toggleClass: vi.fn().mockReturnThis(),
                remove: vi.fn().mockReturnThis(),
                elt: { hasAttribute: vi.fn().mockReturnValue(false) },
            })),
            select: vi.fn().mockReturnValue(null), // By default, no existing elements
            selectAll: vi.fn().mockReturnValue([]),
        } as unknown as Record<string, Mock>;

        mockGameModules = {
            state: {
                getDebugData: vi.fn().mockReturnValue({ on: true }),
            },
            control: {
                getDebugData: vi.fn().mockReturnValue({ lastKey: 'UP' }),
            },
        };

        debuggerInstance = new Debugger(mockGameModules as unknown as GameModules, mockP5 as unknown as p5);
    });

    it('should setup DOM elements when enabled', () => {
        // [ACT]
        debuggerInstance.setup();

        // [ASSERT]
        expect(mockP5.createElement).toHaveBeenCalledWith('details');
        expect(mockP5.createElement).toHaveBeenCalledWith('summary');
        expect((mockGameModules.state as { getDebugData: Mock }).getDebugData).toHaveBeenCalled();
        expect((mockGameModules.control as { getDebugData: Mock }).getDebugData).toHaveBeenCalled();
    });

    it('should not setup DOM elements if debugger is disabled', () => {
        // [ARRANGE]
        // @ts-expect-error - testing configuration override
        configs.game.debugger.enabled = false;

        // [ACT]
        debuggerInstance.setup();

        // [ASSERT]
        expect(mockP5.createElement).not.toHaveBeenCalled();

        // Restore for other tests
        // @ts-expect-error - testing configuration override
        configs.game.debugger.enabled = true;
    });

    it('should set game modules and preserve open states of details tabs', () => {
        // [ARRANGE]

        // Mock the presence of an existing open #debugger details
        const existingDetails = {
            elt: { hasAttribute: vi.fn().mockImplementation(attr => attr === 'open') },
            remove: vi.fn(),
        };

        // Mock an open module details element
        const openModuleDetails = {
            id: vi.fn().mockReturnValue('debugger-state'),
            elt: { hasAttribute: vi.fn().mockImplementation(attr => attr === 'open') },
        };

        mockP5.select.mockImplementation((selector: string) => {
            if (selector === '#debugger') return existingDetails;
            return { elt: { hasAttribute: () => false } };
        });

        mockP5.selectAll.mockImplementation((selector: string) => {
            if (selector === '.debugger-module') return [openModuleDetails];
            return [];
        });

        const newGameModules = {
            state: { getDebugData: vi.fn().mockReturnValue({ on: false }) },
            grid: { getDebugData: vi.fn().mockReturnValue({ width: 10 }) },
        };

        // Track how attributes are applied to elements being created
        const createSpy = vi.spyOn(mockP5, 'createElement');

        // [ACT]
        debuggerInstance.setGameModules(newGameModules as unknown as GameModules);

        // [ASSERT]
        expect(existingDetails.remove).toHaveBeenCalled();

        // Ensure new 'details' element was set to 'open' because wasOpen was true
        // And 'debugger-state' module also got 'open' attribute

        // Find created elements matching the details container
        const detailsInvocations = createSpy.mock.results.filter(r => r.value.id.mock.calls.some((c: unknown[]) => c[0] === 'debugger'));
        expect(detailsInvocations.length).toBeGreaterThan(0);
        expect(detailsInvocations[0].value.attribute).toHaveBeenCalledWith('open', '');

        // Find module elements matching 'debugger-state'
        const stateModuleInvocations = createSpy.mock.results.filter(r => r.value.id.mock.calls.some((c: unknown[]) => c[0] === 'debugger-state'));
        expect(stateModuleInvocations.length).toBeGreaterThan(0);
        expect(stateModuleInvocations[0].value.attribute).toHaveBeenCalledWith('open', '');
    });

    it('should update debugger values', () => {
        // [ARRANGE]
        debuggerInstance.setup();

        // Change mock implementation to simulate updated state
        (mockGameModules.state as { getDebugData: Mock }).getDebugData.mockReturnValue({ on: false });

        // [ACT]
        debuggerInstance.update();

        // [ASSERT]
        // the mock elements returned by createElement have a `html` spy
        // Let's verify that the html spy was called with 'false' (the updated value)
        const allHtmlCalls = mockP5.createElement.mock.results.map(res => res.value.html.mock.calls).flat(1);

        expect(allHtmlCalls).toContainEqual(['false']);
    });
});
