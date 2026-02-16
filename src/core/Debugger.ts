import configs from '../config/configs';
import { Debuggable, Initializable } from './types/Interfaces';
import { GameModules } from './types/Types';

export default class Debugger implements Initializable {
    private _modules: GameModules;
    private _lastUpdate: number;

    constructor(modules: GameModules) {
        this._modules = modules;
        this._lastUpdate = new Date().getTime();
    }

    setup() {
        if (!configs.game.debugger.enabled) {
            return;
        }

        // Create debugger element
        const details = document.createElement('details');
        details.open = true;
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

    async update() {
        if (!configs.game.debugger.enabled) {
            return;
        }

        if (new Date().getTime() - this._lastUpdate >= configs.game.debugger.msInterval) {
            console.log('Updating debugger');
            this._lastUpdate = new Date().getTime();

            Object.entries(this._modules).forEach(([key, module]) => {
                if ('getDebugData' in module) {
                    const moduleDebugData = (module as Debuggable).getDebugData();

                    Object.entries(moduleDebugData).forEach(([dataKey, dataValue]) => {
                        const dataElement = document.getElementById(`debugger-container-${key}-${dataKey}`);
                        if (dataElement) {
                            const dataValueElement = dataElement.querySelector('span');
                            if (dataValueElement) {
                                dataValueElement.textContent = `${dataValue}`;
                            }
                        }
                    });
                }
            });
        }
    }
}
