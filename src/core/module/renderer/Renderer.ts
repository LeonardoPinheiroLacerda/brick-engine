import Cell from '../../interface/Cell';

export default interface Renderer {
    setup(): void;
    render(grid: Cell[][]): void;
}
