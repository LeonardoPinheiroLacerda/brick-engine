import P5 from 'p5';

export default class RelativeValuesHelper {
    static getRelativeWidth(p: P5, size: number): number {
        return size * p.width;
    }

    static getRelativeHeight(p: P5, size: number): number {
        return size * p.height;
    }
}
