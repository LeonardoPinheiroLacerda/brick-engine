import Game from '../core/Game';

export interface GameEntry {
    name: string;
    url?: string;
    instance?: Game;
}
