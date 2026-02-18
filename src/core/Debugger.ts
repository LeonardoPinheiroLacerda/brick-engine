import configs from '../config/configs';
import { Debuggable, Initializable } from './types/Interfaces';
import { GameModules } from './types/Types';

/**
 * Handles the on-screen debug overlay.
 * Creates a DOM-based interface to display real-time debug data from game modules.
 */
export default class Debugger implements Initializable {
    private _modules: GameModules;
    private _lastUpdate: number;
    private _domCache: Map<string, HTMLElement> = new Map();

    /**
     * Creates an instance of Debugger.
     *
     * @param {GameModules} modules - The collection of game modules to monitor.
     */
    constructor(modules: GameModules) {
        this._modules = modules;
        this._lastUpdate = performance.now();
    }

    /**
     * Initializes the debugger.
     * Creates the DOM elements for the debug overlay if enabled in config.
     */
    setup() {
        if (!configs.game.debugger.enabled) {
            return;
        }

        // Create debugger element
        const details = document.createElement('details');
        details.id = 'debugger';

        const summary = document.createElement('summary');
        summary.id = 'debugger-summary';
        summary.textContent = 'Debug';
        details.appendChild(summary);

        document.body.appendChild(details);

        Object.entries(this._modules).forEach(([key, module]) => {
            if ('getDebugData' in module) {
                const moduleDetail = document.createElement('details');
                moduleDetail.classList.add('debugger-module');
                moduleDetail.id = `debugger-${key}`;

                const moduleSummary = document.createElement('summary');
                moduleSummary.id = `debugger-${key}-summary`;
                moduleSummary.textContent = key;
                moduleSummary.classList.add('debugger-module-summary');
                moduleDetail.appendChild(moduleSummary);

                const moduleDebugData = (module as Debuggable).getDebugData();

                Object.entries(moduleDebugData).forEach(([dataKey, dataValue]) => {
                    const dataElement = document.createElement('div');
                    dataElement.classList.add('debugger-container');
                    dataElement.id = `debugger-container-${key}-${dataKey}`;

                    const dataKeyElement = document.createElement('p');
                    dataKeyElement.id = `debugger-${key}-${dataKey}`;
                    dataKeyElement.textContent = `${dataKey}:`;

                    const dataValueElement = document.createElement('span');
                    dataValueElement.id = `debugger-${key}-${dataKey}-value`;
                    dataValueElement.textContent = `${dataValue}`;

                    // Cache the value element for fast updates
                    this._domCache.set(`${key}-${dataKey}`, dataValueElement);

                    dataElement.appendChild(dataKeyElement);
                    dataElement.appendChild(dataValueElement);

                    moduleDetail.appendChild(dataElement);

                    dataElement.addEventListener('click', () => {
                        dataElement.classList.toggle('highlight');
                    });
                });

                details.appendChild(moduleDetail);
            }
        });
    }

    /**
     * Updates the debug information in the DOM.
     * Throttle updates based on configuration interval.
     */
    async update() {
        if (!configs.game.debugger.enabled || !this._modules) {
            return;
        }

        const now = performance.now();
        if (now - this._lastUpdate >= configs.game.debugger.msInterval) {
            this._lastUpdate = now;

            Object.entries(this._modules).forEach(([key, module]) => {
                if ('getDebugData' in module) {
                    const moduleDebugData = (module as Debuggable).getDebugData();

                    Object.entries(moduleDebugData).forEach(([dataKey, dataValue]) => {
                        const cachedElement = this._domCache.get(`${key}-${dataKey}`);
                        if (cachedElement) {
                            cachedElement.textContent = `${dataValue}`;
                        }
                    });
                }
            });
        }
    }

    /**
     * Removes the debugger overlay from the DOM and clears the cache.
     */
    destroy() {
        const debuggerElement = document.getElementById('debugger');
        if (debuggerElement) {
            debuggerElement.remove();
        }
        this._domCache.clear();
    }
}
