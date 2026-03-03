import { Initializable } from '../core/types/Interfaces';
import RendererContext from '../core/context/RendererContext';
import p5 from 'p5';

/**
 * Modal displaying keyboard shortcuts, visible only on desktop.
 */
export default class ShortcutsModal implements Initializable {
    private _container: p5.Element;
    private _closeButton: p5.Element;
    private _externalToggleButton: p5.Element;

    constructor() {}

    /**
     * Bootstraps the Vanilla DOM creation for the shortcuts modal.
     */
    setup() {
        const { p } = RendererContext;

        this._externalToggleButton = p.createButton('Shortcuts [H]');
        this._externalToggleButton.parent(p.select('body'));
        this._externalToggleButton.id('btn-shortcuts-external');
        this._externalToggleButton.mousePressed(() => this.toggle());

        this._container = p.createDiv();
        this._container.parent(p.select('body'));
        this._container.id('shortcuts-modal-background');
        this._container.class('hidden');

        const modal = p.createDiv();
        modal.parent(this._container);
        modal.id('shortcuts-modal');

        const frame = p.createDiv();
        frame.parent(modal);
        frame.id('shortcuts-modal-frame');

        const title = p.createElement('h2');
        title.parent(frame);
        title.html('Keyboard Shortcuts');

        const screen = p.createDiv();
        screen.parent(frame);
        screen.id('shortcuts-modal-screen');

        const grid = p.createDiv();
        grid.parent(screen);
        grid.class('shortcuts-grid');

        const shortcuts = [
            { key: 'Arrows / WASD', action: 'Move' },
            { key: 'J', action: 'Action' },
            { key: '1', action: 'Power' },
            { key: '2', action: 'Start / Pause' },
            { key: '3', action: 'Sound' },
            { key: '4', action: 'Reset' },
            { key: '5', action: 'Exit' },
            { key: '6', action: 'Enable Colors' },
            { key: '7', action: 'Enable Trackpad' },
            { key: 'H', action: 'Help (Shortcuts)' },
        ];

        shortcuts.forEach(s => {
            const item = p.createDiv();
            item.parent(grid);
            item.class('shortcut-item');

            const key = p.createSpan();
            key.parent(item);
            key.class('shortcut-key');
            key.html(s.key);

            const action = p.createSpan();
            action.parent(item);
            action.class('shortcut-action');
            action.html(s.action);
        });

        this._closeButton = p.createButton('Close');
        this._closeButton.parent(modal);
        this._closeButton.id('close-shortcuts');
        this._closeButton.mousePressed(() => this._hide());
    }

    /**
     * Toggles the visibility of the shortcuts modal.
     */
    toggle() {
        if (this._container.hasClass('hidden')) {
            this._show();
        } else {
            this._hide();
        }
    }

    private _show() {
        this._container.removeClass('hidden');
    }

    private _hide() {
        this._container.addClass('hidden');
    }
}
