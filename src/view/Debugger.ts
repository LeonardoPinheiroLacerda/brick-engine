import p5 from 'p5';
import { Debuggable, Initializable } from '../core/types/Interfaces';
import { GameModules } from '../core/types/Types';
import configs from '../config/configs';

type DebuggerModule = {
    module: Debuggable;
    properties: DebuggerProperty[];
};

type DebuggerProperty = {
    key: string;
    element: p5.Element;
};

export default class NewDebugger implements Initializable {
    private _p: p5;
    private _gameModules: GameModules;

    private _moduleElements: DebuggerModule[] = [];

    constructor(gameModules: GameModules, p: p5) {
        this._gameModules = gameModules;
        this._p = p;
    }

    setup() {
        if (!configs.game.debugger.enabled) return;

        const existingDetails = this._p.select('#debugger');
        const wasOpen = existingDetails ? existingDetails.elt.hasAttribute('open') : false;
        const openModules = new Set<string>();

        if (existingDetails) {
            const modules = this._p.selectAll('.debugger-module');
            modules.forEach(module => {
                if (module.elt.hasAttribute('open')) {
                    openModules.add(module.id());
                }
            });
            existingDetails.remove();
        }

        this._moduleElements = [];

        const details = this._p.createElement('details');
        details.id('debugger');
        if (wasOpen) details.attribute('open', '');
        details.parent(this._p.select('body'));

        const summary = this._p.createElement('summary');
        summary.id('debugger-summary');
        summary.html('Debug');
        summary.parent(details);

        Object.entries(this._gameModules).forEach(([name, module]) => {
            if ('getDebugData' in module) {
                const moduleProperty: DebuggerModule = {
                    module: module as Debuggable,
                    properties: [],
                };

                const moduleDetails = this._p.createElement('details');
                moduleDetails.class('debugger-module');
                moduleDetails.id(`debugger-${name}`);
                if (openModules.has(`debugger-${name}`)) {
                    moduleDetails.attribute('open', '');
                }
                moduleDetails.parent(details);

                const moduleSummary = this._p.createElement('summary');
                moduleSummary.id(`debugger-${name}-summary`);
                moduleSummary.html(name);
                moduleSummary.class('debugger-module-summary');
                moduleSummary.parent(moduleDetails);

                const moduleData = (module as unknown as Debuggable).getDebugData();

                Object.entries(moduleData).forEach(([key, value]) => {
                    const dataElement = this._p.createElement('div');
                    dataElement.class('debugger-container');
                    dataElement.id(`debugger-container-${key}-${value}`);
                    dataElement.parent(moduleDetails);

                    dataElement.mouseClicked(() => {
                        dataElement.toggleClass('highlight');
                    });

                    const dataKeyElement = this._p.createElement('p');
                    dataKeyElement.id(`debugger-${key}-${value}`);
                    dataKeyElement.html(`${key}:`);
                    dataKeyElement.parent(dataElement);

                    const dataValueElement = this._p.createElement('span');
                    dataValueElement.id(`debugger-${key}-${value}-value`);
                    dataValueElement.html(`${value}`);
                    dataValueElement.parent(dataElement);

                    moduleProperty.properties.push({
                        key,
                        element: dataValueElement,
                    });
                });

                this._moduleElements.push(moduleProperty);
            }
        });
    }

    setGameModules(gameModules: GameModules) {
        this._gameModules = gameModules;
        this.setup();
    }

    update() {
        this._moduleElements.forEach(moduleProperty => {
            const data = moduleProperty.module.getDebugData();

            moduleProperty.properties.forEach(property => {
                property.element.html(`${data[property.key]}`);
            });
        });
    }
}
