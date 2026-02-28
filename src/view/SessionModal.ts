import { Initializable } from '../core/types/Interfaces';
import RendererContext from '../core/context/RendererContext';
import p5 from 'p5';

/**
 * Specialized interrupt overlay confirming persistence restores asynchronously.
 *
 * It generates vanilla DOM elements that intentionally block Canvas execution pointers,
 * preventing game logics from polluting local memory until a Human clearly decides
 * whether to load or destroy auto-saved metadata safely.
 */
export default class SessionModal implements Initializable {
    private _container: p5.Element;
    private _confirmButton: p5.Element;
    private _cancelButton: p5.Element;

    constructor() {}

    /**
     * Bootstraps the Vanilla DOM creation assigning hidden CSS parameters until execution calls.
     *
     * @returns {void} Returns nothing.
     */
    setup() {
        const { p } = RendererContext;
        this._container = p.createDiv();
        this._container.parent(p.select('body'));
        this._container.id('modal-background');
        this._container.class('hidden');

        const modal = p.createDiv();
        modal.parent(this._container);
        modal.id('session-modal');

        const frame = p.createDiv();
        frame.parent(modal);
        frame.id('session-modal-frame');

        const title = p.createP();
        title.parent(frame);
        title.html('Brick Engine Session');

        const screen = p.createDiv();
        screen.parent(frame);
        screen.id('session-modal-screen');

        const screenText = p.createP();
        screenText.parent(screen);
        screenText.html('<span>Looks like you have an active session.</span><br><br>Do you want to continue?');

        const buttonsContainer = p.createDiv();
        buttonsContainer.parent(modal);
        buttonsContainer.id('session-modal-buttons');

        this._cancelButton = p.createButton('Cancel');
        this._cancelButton.parent(buttonsContainer);
        this._cancelButton.class('session-modal-button');

        this._confirmButton = p.createButton('Confirm');
        this._confirmButton.parent(buttonsContainer);
        this._confirmButton.class('session-modal-button');
    }

    /**
     * Removes the CSS hidden barrier and binds strictly required callback endpoints to the physical buttons.
     *
     * @param {function(): void} onConfirm - The pointer mapped when the player wants to restore data.
     * @param {function(): void} onCancel - The pointer mapped when the player declines restoration.
     * @returns {void} Returns nothing.
     */
    show(onConfirm: () => void, onCancel: () => void) {
        this._confirmButton.mousePressed(() => {
            onConfirm();
            this._hide();
        });
        this._cancelButton.mousePressed(() => {
            onCancel();
            this._hide();
        });

        this._container.removeClass('hidden');
    }

    /**
     * Nullifies listeners and applies strictly blocking CSS classes safely.
     *
     * @returns {void} Returns nothing.
     */
    private _hide() {
        this._confirmButton.mousePressed(null);
        this._cancelButton.mousePressed(null);

        this._container.addClass('hidden');
    }
}
