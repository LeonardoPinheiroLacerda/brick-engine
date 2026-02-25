import p5 from 'p5';
import { Debuggable, Initializable } from '../core/types/Interfaces';
import RendererContext from '../core/context/RendererContext';
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
    private _gameModules: GameModules;

    private _moduleElements: DebuggerModule[] = [];

    constructor(gameModules: GameModules) {
        this._gameModules = gameModules;
    }

    setup() {
        if (!configs.game.debugger.enabled) return;
        const { p } = RendererContext;

        const existingDetails = p.select('#debugger');
        const wasOpen = existingDetails ? existingDetails.elt.hasAttribute('open') : false;
        const openModules = new Set<string>();

        if (existingDetails) {
            const modules = p.selectAll('.debugger-module');
            modules.forEach(module => {
                if (module.elt.hasAttribute('open')) {
                    openModules.add(module.id());
                }
            });
            existingDetails.remove();
        }

        this._moduleElements = [];

        const details = p.createElement('details');
        details.id('debugger');
        if (wasOpen) details.attribute('open', '');
        details.parent(p.select('body'));

        const summary = p.createElement('summary');
        summary.id('debugger-summary');
        summary.html('Debug');
        summary.parent(details);

        Object.entries(this._gameModules).forEach(([name, module]) => {
            if ('getDebugData' in module) {
                const moduleProperty: DebuggerModule = {
                    module: module as Debuggable,
                    properties: [],
                };

                const moduleDetails = p.createElement('details');
                moduleDetails.class('debugger-module');
                moduleDetails.id(`debugger-${name}`);
                if (openModules.has(`debugger-${name}`)) {
                    moduleDetails.attribute('open', '');
                }
                moduleDetails.parent(details);

                const moduleSummary = p.createElement('summary');
                moduleSummary.id(`debugger-${name}-summary`);
                moduleSummary.html(name);
                moduleSummary.class('debugger-module-summary');
                moduleSummary.parent(moduleDetails);

                const moduleData = (module as unknown as Debuggable).getDebugData();

                Object.entries(moduleData).forEach(([key, value]) => {
                    const dataElement = p.createElement('div');
                    dataElement.class('debugger-container');
                    dataElement.id(`debugger-container-${key}-${value}`);
                    dataElement.parent(moduleDetails);

                    dataElement.mouseClicked(() => {
                        dataElement.toggleClass('highlight');
                    });

                    const dataKeyElement = p.createElement('p');
                    dataKeyElement.id(`debugger-${key}-${value}`);
                    dataKeyElement.html(`${key}:`);
                    dataKeyElement.parent(dataElement);

                    const dataValueElement = p.createElement('span');
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
