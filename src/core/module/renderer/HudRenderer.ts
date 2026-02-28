import { Renderer } from '../../types/modules';
import { Cell, Coordinate, GameModules, RendererMetrics } from '../../types/Types';
import { Color, FontAlign, FontSize, FontVerticalAlign } from '../../types/enums';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import configs from '../../../config/configs';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import RendererContext from '../../context/RendererContext';

/**
 * Dedicated visual presentation component isolating Heads-Up Display (HUD) mechanics.
 *
 * Implements the {@link Renderer} interface to decouple metadata logic (level, scores, Next Piece
 * visuals) away from core game physics. By translating absolute space constraints mapped in
 * `configs.screenLayout`, it creates responsive graphical UI outputs without expensive real-time
 * geometry processing on each execution tick.
 */
export default class HudRenderer implements Renderer {
    private _gridOrigin: Coordinate;

    private _cellSize: number;

    private _hudBorderRect: {
        x: number;
        y: number;
        w: number;
        h: number;
    };

    /**
     * Binds strictly defined initial layouts mapping dynamically sized objects over absolute space.
     *
     * @param {RendererMetrics} rendererMetrics - Pre-calculated scale components established globally.
     * @returns {void} Returns nothing.
     */
    setup(rendererMetrics: RendererMetrics): void {
        this._cellSize = rendererMetrics.cell.size;
        this._gridOrigin = {
            x: CoordinateHelper.getHudPosX(0.078, rendererMetrics.display.width),
            y: CoordinateHelper.getHudPosY(0.375, rendererMetrics.display.height),
        };

        this._hudBorderRect = {
            x: this._gridOrigin.x - RelativeValuesHelper.getRelativeWidth(0.005),
            y: this._gridOrigin.y - RelativeValuesHelper.getRelativeHeight(0.005),
            w: this._cellSize * 4 + RelativeValuesHelper.getRelativeWidth(0.01),
            h: this._cellSize * 4 + RelativeValuesHelper.getRelativeHeight(0.01),
        };
    }

    /**
     * Orchestrates the active frame-tick UI compilation logic sequences.
     *
     * @param {Cell[][]} grid - A standard mapping hook currently unused by this context explicitly.
     * @param {GameModules} modules - The active registry exposing GameScore and GameState values.
     * @returns {void} Returns nothing.
     */
    render(grid: Cell[][], modules: GameModules): void {
        this._renderHud(modules);
        this._drawHudGrid(modules);
    }

    /**
     * Compiles dynamic string payloads over absolute canvas locations tracking user data metrics.
     *
     * @param {GameModules} modules - Global registry resolving access to the Score system.
     * @returns {void} Returns nothing.
     */
    private _renderHud(modules: GameModules): void {
        const { p } = RendererContext;
        const { text, state, score } = modules;

        p.push();

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

        p.pop();

        this._drawHudGrid(modules);
    }

    /**
     * Maps the static inner-HUD coordinate box defining where piece previews exist natively.
     *
     * @param {GameModules} modules - Engine registry exposing the `GameHudGrid` explicitly.
     * @returns {void} Returns nothing.
     */
    private _drawHudGrid(modules: GameModules): void {
        const { p } = RendererContext;
        const { hudGrid, state } = modules;

        p.push();

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

        p.noFill();
        p.stroke(state.isOn() ? Color.DEFAULT : Color.INACTIVE);

        p.rect(this._hudBorderRect.x, this._hudBorderRect.y, this._hudBorderRect.w, this._hudBorderRect.h);

        p.pop();
    }

    /**
     * Optimized internal draw operation processing graphical offsets for the sub-grid layer.
     *
     * @param {object} params - Explicit physical boundary configuration dictionary.
     * @param {number} params.w - The scale cell width footprint constraint.
     * @param {number} params.h - The scale cell height footprint constraint.
     * @param {number} params.posX - Translating X absolute starting point coordinate limit.
     * @param {number} params.posY - Translating Y absolute starting point coordinate limit.
     * @param {Color} params.color - The specific string enum resolving rendering palette strokes.
     * @returns {void} Returns nothing.
     */
    private drawCellElement({ w, posX, posY, color }: { w: number; h: number; posX: number; posY: number; color: Color }): void {
        const { p } = RendererContext;
        const { margin: cellMargin, padding: cellPadding, strokeWeight: cellStrokeWeight } = configs.screenLayout.cell;

        const innerOffset = cellMargin * w;
        const innerSize = w - cellMargin * w * 2;
        const paddingOffset = cellPadding * w;
        const paddingSize = w - cellPadding * w * 2;
        const strokeWeight = cellStrokeWeight * w;

        p.push();

        p.translate(posX, posY);

        p.strokeWeight(strokeWeight);
        p.stroke(color);

        // Outer Box
        p.noFill();
        p.rect(innerOffset, innerOffset, innerSize, innerSize);

        // Inner Fill
        p.fill(color);
        p.rect(paddingOffset, paddingOffset, paddingSize, paddingSize);

        p.pop();
    }
}
