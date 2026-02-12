import { Cell } from './Types';

export interface Initializable {
    setup(): void;
}

export interface Renderer extends Initializable {
    render(grid: Cell[][]): void;
}
