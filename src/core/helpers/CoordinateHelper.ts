import P5 from 'p5';
import Coordinate from '../types/Coordinate';
import configs from '../../config/configs';
import RelativeValuesHelper from './RelativeValuesHelper';

export default class CoordinateHelper {
    static getRelativeCoordinate(p: P5, coordinate: Coordinate): Coordinate {
        return {
            x: RelativeValuesHelper.getRelativeWidth(p, coordinate.x),
            y: RelativeValuesHelper.getRelativeHeight(p, coordinate.y),
        };
    }

    static getDisplayPosX(p: P5, x: number, displayWidth: number): number {
        const { margin } = configs.screenLayout.display;

        return displayWidth * x + RelativeValuesHelper.getRelativeWidth(p, margin);
    }

    static getDisplayPosY(p: P5, y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;
        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(p, margin);
    }

    static getHudPosX(p: P5, x: number, displayWidth: number): number {
        const { margin } = configs.screenLayout.display;
        const zero = displayWidth + RelativeValuesHelper.getRelativeWidth(p, margin) * 2;
        const width = p.width - zero - RelativeValuesHelper.getRelativeWidth(p, margin);
        return width * x + zero;
    }
    static getHudPosY(p: P5, y: number, displayHeight: number): number {
        const { margin } = configs.screenLayout.display;

        return displayHeight * y + RelativeValuesHelper.getRelativeHeight(p, margin);
    }
}
