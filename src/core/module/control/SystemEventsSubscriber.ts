import { ControlEventType, ControlKey } from '../../types/Types';
import { Control } from '../../types/modules';

export default class SystemEventsSubscriber {
    private _control: Control;

    constructor(control: Control) {
        this._control = control;
    }

    subscribe(): void {
        this._control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, event => event.modules.state.toggleOn());
        this._control.subscribe(ControlKey.SOUND, ControlEventType.PRESSED, event => event.modules.state.toggleMuted());
        this._control.subscribe(ControlKey.COLOR, ControlEventType.PRESSED, event => event.modules.state.toggleColorEnabled());
        this._control.subscribe(ControlKey.RESET, ControlEventType.PRESSED, event => {
            event.modules.grid.resetGrid();
            if (event.modules.state.gameOver) {
                event.modules.state.toggleGameOver();
            }
        });
        this._control.subscribe(ControlKey.START_PAUSE, ControlEventType.PRESSED, event => {
            if (!event.modules.state.start) {
                event.modules.state.toggleStart();
            }
            event.modules.state.toggleRunning();
        });
    }
}
