import { Initializable } from '../core/types/Interfaces';
import p5 from 'p5';

export default class SessionModal implements Initializable {
    private _p: p5;

    private _container: p5.Element;
    private _confirmButton: p5.Element;
    private _cancelButton: p5.Element;

    constructor(p: p5) {
        this._p = p;
    }

    setup() {
        this._container = this._p.createDiv();
        this._container.parent(this._p.select('body'));
        this._container.id('modal-background');
        this._container.class('hidden');

        const modal = this._p.createDiv();
        modal.parent(this._container);
        modal.id('session-modal');

        const frame = this._p.createDiv();
        frame.parent(modal);
        frame.id('session-modal-frame');

        const title = this._p.createP();
        title.parent(frame);
        title.html('Brick Engine Session');

        const screen = this._p.createDiv();
        screen.parent(frame);
        screen.id('session-modal-screen');

        const screenText = this._p.createP();
        screenText.parent(screen);
        screenText.html('<span>Looks like you have an active session.</span><br><br>Do you want to continue?');

        const buttonsContainer = this._p.createDiv();
        buttonsContainer.parent(modal);
        buttonsContainer.id('session-modal-buttons');

        this._cancelButton = this._p.createButton('Cancel');
        this._cancelButton.parent(buttonsContainer);
        this._cancelButton.class('session-modal-button');

        this._confirmButton = this._p.createButton('Confirm');
        this._confirmButton.parent(buttonsContainer);
        this._confirmButton.class('session-modal-button');
    }

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

    private _hide() {
        this._confirmButton.mousePressed(null);
        this._cancelButton.mousePressed(null);

        this._container.addClass('hidden');
    }
}
