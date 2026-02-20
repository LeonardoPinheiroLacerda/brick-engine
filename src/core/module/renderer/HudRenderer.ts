import { Renderer } from '../../types/modules';
import { Cell, Coordinate, GameModules, RendererMetrics } from '../../types/Types';
import p5 from 'p5';
import { Color, FontAlign, FontSize, FontVerticalAlign } from '../../types/enums';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import configs from '../../../config/configs';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';

/**
 * Responsible for rendering the Heads-Up Display (HUD).
 * Displays game information like Score, High Score, Level, and the Next Piece Preview.
 */
export default class HudRenderer implements Renderer {
    private _p: p5;

    private _gridOrigin: Coordinate;

    private _cellSize: number;

    private _hudBorderRect: {
        x: number;
        y: number;
        w: number;
        h: number;
    };

    /**
     * Creates an instance of HudRenderer.
     *
     * @param {p5} p - The p5 instance.
     */
    constructor(p: p5) {
        this._p = p;
    }

    /**
     * Initializes the HUD with calculated metrics.
     * Sets up the grid origin and border rectangle for the "next piece" preview area.
     *
     * @param {RendererMetrics} rendererMetrics - The shared renderer metrics.
     */
    setup(rendererMetrics: RendererMetrics): void {
        this._cellSize = rendererMetrics.cell.size;
        this._gridOrigin = {
            x: CoordinateHelper.getHudPosX(this._p, 0.078, rendererMetrics.display.width),
            y: CoordinateHelper.getHudPosY(this._p, 0.375, rendererMetrics.display.height),
        };

        this._hudBorderRect = {
            x: this._gridOrigin.x - RelativeValuesHelper.getRelativeWidth(this._p, 0.005),
            y: this._gridOrigin.y - RelativeValuesHelper.getRelativeHeight(this._p, 0.005),
            w: this._cellSize * 4 + RelativeValuesHelper.getRelativeWidth(this._p, 0.01),
            h: this._cellSize * 4 + RelativeValuesHelper.getRelativeHeight(this._p, 0.01),
        };
    }

    /**
     * Renders all HUD elements.
     *
     * @param {Cell[][]} grid - The main game grid (unused in HUD, but required by interface).
     * @param {GameModules} modules - The game modules for retrieving state and score.
     */
    render(grid: Cell[][], modules: GameModules): void {
        this._renderHud(modules);
        this._drawHudGrid(modules);
    }

    /**
     * Renders the text-based HUD elements (Score, Level, Status).
     *
     * @param {GameModules} modules - The game modules.
     */
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
        text.textOnHud(score.highScore.toString(), { x: 0.05, y: 0.3 });

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

    /**
     * Renders the preview grid for the next piece.
     *
     * @param {GameModules} modules - The game modules.
     */
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
                posX: this._gridOrigin.x + this._cellSize * x,
                posY: this._gridOrigin.y + this._cellSize * y,
                color,
            });
        });

        this._p.noFill();
        this._p.stroke(state.isOn() ? Color.DEFAULT : Color.INACTIVE);

        this._p.rect(this._hudBorderRect.x, this._hudBorderRect.y, this._hudBorderRect.w, this._hudBorderRect.h);

        this._p.pop();
    }

    /**
     * Helper method to draw a single cell on the HUD.
     * Identical in logic to DisplayRenderer's cell drawing but localized for HUD.
     *
     * @param {object} params - The drawing parameters.
     * @param {number} params.w - Width of the cell.
     * @param {number} params.posX - Absolute X position.
     * @param {number} params.posY - Absolute Y position.
     * @param {Color} params.color - Color of the cell.
     */
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
