import { ControlKey } from '../../types/enums';
import { Control } from '../../types/modules';

export default class SystemEventsSubscriber {
    private _control: Control;

    constructor(control: Control) {
        this._control = control;
    }

    subscribe(): void {
        this._control.subscribe(ControlKey.POWER, 'pressed', event => event.modules.state.toggleOn());
        this._control.subscribe(ControlKey.SOUND, 'pressed', event => event.modules.state.toggleMuted());
        this._control.subscribe(ControlKey.COLOR, 'pressed', event => event.modules.state.toggleColorEnabled());
        this._control.subscribe(ControlKey.RESET, 'pressed', event => {
            event.modules.grid.resetGrid();
            if (event.modules.state.gameOver) {
                event.modules.state.toggleGameOver();
            }
        });
        this._control.subscribe(ControlKey.START_PAUSE, 'pressed', event => {
            if (!event.modules.state.start) {
                event.modules.state.toggleStart();
            }
            event.modules.state.toggleRunning();
        });
    }
}
