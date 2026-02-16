import { Renderer } from '../../types/modules';
import { Cell, GameModules, RendererMetrics } from '../../types/Types';
import P5 from 'p5';
import { Color, FontAlign, FontSize, FontVerticalAlign } from '../../types/enums';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import configs from '../../../config/configs';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';

export default class HudRenderer implements Renderer {
    private _p: P5;

    private _coordX: number;
    private _coordY: number;

    private _cellSize: number;

    private _rectValues: {
        x: number;
        y: number;
        w: number;
        h: number;
    };

    constructor(p: P5) {
        this._p = p;
    }

    setup(rendererMetrics: RendererMetrics): void {
        this._cellSize = rendererMetrics.cell.size;
        this._coordX = CoordinateHelper.getHudPosX(this._p, 0.078, rendererMetrics.display.width);
        this._coordY = CoordinateHelper.getHudPosY(this._p, 0.375, rendererMetrics.display.height);

        this._rectValues = {
            x: this._coordX - RelativeValuesHelper.getRelativeWidth(this._p, 0.005),
            y: this._coordY - RelativeValuesHelper.getRelativeHeight(this._p, 0.005),
            w: this._cellSize * 4 + RelativeValuesHelper.getRelativeWidth(this._p, 0.01),
            h: this._cellSize * 4 + RelativeValuesHelper.getRelativeHeight(this._p, 0.01),
        };
    }

    render(grid: Cell[][], modules: GameModules): void {
        this._renderHud(modules);
        this._drawHudGrid(modules);
    }

    private _renderHud(modules: GameModules): void {
        const { text, state, score } = modules;

        this._p.push();

        text.setTextSize(FontSize.SMALL);
        text.setInactiveText();
        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);

        //Placeholders text
        text.textOnHud('88888888', { x: 0.05, y: 0.13 });
        text.textOnHud('88888888', { x: 0.05, y: 0.3 });
        text.textOnHud('88 - 88', { x: 0.05, y: 0.8 });

        if (state.isOn()) {
            text.setActiveText();
        }

        //Score text
        text.textOnHud('Score', { x: 0.05, y: 0.06 });
        text.textOnHud(score.score.toString(), { x: 0.05, y: 0.13 });

        //Hi-Score text
        text.textOnHud('Hi-Score', { x: 0.05, y: 0.23 });
        text.textOnHud(state.getHighScore().toString(), { x: 0.05, y: 0.3 });

        //Level text
        text.textOnHud('Level', { x: 0.05, y: 0.72 });
        const levelValue = `${score.level < 10 ? '0' + score.level : score.level} - ${score.maxLevel}`;
        text.textOnHud(levelValue, { x: 0.05, y: 0.8 });

        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);

        //Paused text
        if (state.isPaused()) {
            text.setActiveText();
        } else {
            text.setInactiveText();
        }
        text.textOnHud('Paused', { x: 0.5, y: 0.9 });

        //Muted text
        if (state.isOn() && state.isMuted()) {
            text.setActiveText();
        } else {
            text.setInactiveText();
        }
        text.textOnHud('Muted', { x: 0.5, y: 0.97 });

        this._p.pop();

        this._drawHudGrid(modules);
    }

    private _drawHudGrid(modules: GameModules): void {
        const { hudGrid, state } = modules;

        this._p.push();

        hudGrid.forEach(cell => {
            const { x, y } = cell.coordinate;

            if (state.isOff() && !state.isPlaying()) {
                cell.value = 0;
            }

            let color = cell.value !== 0 ? Color.DEFAULT : Color.INACTIVE;

            if (state.isColorEnabled() && cell.value !== 0) {
                color = cell.color;
            }

            this.drawCellElement({
                w: this._cellSize,
                h: this._cellSize,
                posX: this._coordX + this._cellSize * x,
                posY: this._coordY + this._cellSize * y,
                color,
            });
        });

        this._p.noFill();
        this._p.stroke(state.isOn() ? Color.DEFAULT : Color.INACTIVE);

        this._p.rect(this._rectValues.x, this._rectValues.y, this._rectValues.w, this._rectValues.h);

        this._p.pop();
    }

    private drawCellElement({ w, posX, posY, color }: { w: number; h: number; posX: number; posY: number; color: Color }): void {
        const { margin: cellMargin, padding: cellPadding, strokeWeight: cellStrokeWeight } = configs.screenLayout.cell;

        const innerOffset = cellMargin * w;
        const innerSize = w - cellMargin * w * 2;
        const paddingOffset = cellPadding * w;
        const paddingSize = w - cellPadding * w * 2;
        const strokeWeight = cellStrokeWeight * w;

        this._p.push();

        this._p.translate(posX, posY);

        this._p.strokeWeight(strokeWeight);
        this._p.stroke(color);

        // Outer Box
        this._p.noFill();
        this._p.rect(innerOffset, innerOffset, innerSize, innerSize);

        // Inner Fill
        this._p.fill(color);
        this._p.rect(paddingOffset, paddingOffset, paddingSize, paddingSize);

        this._p.pop();
    }
}
