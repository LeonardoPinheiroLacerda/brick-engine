import { Cell } from './Types';
import { Initializable } from './Interfaces';

export interface Renderer extends Initializable {
    render(grid: Cell[][]): void;
}
