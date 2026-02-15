import GameGrid from './GameGrid';

export default class GameHudGrid extends GameGrid {
    get width(): number {
        return 4;
    }

    get height(): number {
        return 4;
    }
}
