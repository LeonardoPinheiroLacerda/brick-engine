import p5 from 'p5';

export default class RelativeValuesHelper {
    static getRelativeWidth(p: p5, size: number): number {
        return size * p.width;
    }

    static getRelativeHeight(p: p5, size: number): number {
        return size * p.height;
    }
}
