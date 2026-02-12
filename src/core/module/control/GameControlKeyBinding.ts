import { Control } from '../../types/modules';

export default class GameControlKeyBinding {
    private _control: Control;

    constructor(control: Control) {
        this._control = control;
    }

    bound() {}

    unbound() {}
}
