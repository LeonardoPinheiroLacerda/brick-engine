import { State } from './modules';
import { Cell } from './Types';

export interface Initializable {
    setup(): void;
}

export interface StateSyncable {
    _state: State;
    syncState(state: State): void;
}

export interface Renderer extends Initializable {
    render(grid: Cell[][]): void;
}
