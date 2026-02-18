import p5 from 'p5';
import configs from '../../../config/configs';
import { FontSize, FontAlign, FontVerticalAlign } from '../../types/enums';
import { Coordinate, RendererMetrics } from '../../types/Types';
import { Debuggable } from '../../types/Interfaces';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import { Text } from '../../types/modules';

/**
 * Handles text rendering and font management within the game.
 *
 * This class orchestrates font initialization, sizing, alignment, and
 * provides methods to render text on specific areas (HUD or Display).
 */
export default class GameText implements Text, Debuggable {
    /** The default font family used for game text. */
    protected defaultFontFamily: string = 'retro-gamming';

    /** Array containing pre-calculated font sizes in pixels. */
    private fontSizes: number[] = [0];

    /** Stores the current display metrics for relative positioning. */
    private _rendererMetrics: RendererMetrics;

    /** The p5 instance used for rendering. */
    private _p: p5;

    /**
     * Creates an instance of GameTexts.
     *
     * @param {p5} p - The p5 instance.
     */
    constructor(p: p5) {
        this._p = p;
    }

    // prettier-ignore
    /**
     * Setup the font and pre-calculates relative font sizes.
     *
     * Uses configuration values to define a set of pixel-perfect font sizes
     * based on current container width.
     *
     * @returns {void}
     */
    setup(): void {
        const { extraSmall, small, medium, large, extraLarge } = configs.screenLayout.fontSize;

        this._p.textFont(this.defaultFontFamily);

        //Define o tamanho das fontes
        this.fontSizes = [];

        this.fontSizes[FontSize.EXTRA_SMALL] = RelativeValuesHelper.getRelativeWidth(this._p, extraSmall);
        this.fontSizes[FontSize.SMALL]       = RelativeValuesHelper.getRelativeWidth(this._p, small);
        this.fontSizes[FontSize.MEDIUM]      = RelativeValuesHelper.getRelativeWidth(this._p, medium);
        this.fontSizes[FontSize.LARGE]       = RelativeValuesHelper.getRelativeWidth(this._p, large);
        this.fontSizes[FontSize.EXTRA_LARGE] = RelativeValuesHelper.getRelativeWidth(this._p, extraLarge);
    }

    /**
     * Sets the display metrics used for relative text positioning.
     *
     * @param {RendererMetrics} rendererMetrics - The current renderer dimensions and origin.
     * @returns {void}
     */
    setRendererMetrics(rendererMetrics: RendererMetrics): void {
        this._rendererMetrics = rendererMetrics;
    }

    /**
     * Sets the fill color of the text based on its state.
     *
     * @param {boolean} state - Whether the text should use the active or inactive color.
     * @returns {void}
     */
    protected setTextState(state: boolean): void {
        const { active, inactive } = configs.colors;
        this._p.fill(state ? active : inactive);
    }

    /**
     * Sets the text color to the active theme color.
     *
     * @returns {void}
     */
    setActiveText(): void {
        this.setTextState(true);
    }

    /**
     * Sets the text color to the inactive theme color.
     *
     * @returns {void}
     */
    setInactiveText(): void {
        this.setTextState(false);
    }

    /**
     * Sets the current font size from predefined values.
     *
     * @param {FontSize} fontSize - The enum value representing the desired size.
     * @returns {void}
     */
    setTextSize(fontSize: FontSize): void {
        this._p.textSize(this.fontSizes[fontSize]);
    }

    /**
     * Configures horizontal and vertical text alignment.
     *
     * @param {FontAlign} fontAlign - Horizontal alignment value.
     * @param {FontVerticalAlign} fontVerticalAlign - Vertical alignment value.
     * @returns {void}
     */
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void {
        this._p.textAlign(fontAlign, fontVerticalAlign);
    }

    /**
     * Renders text on the HUD area using relative coordinates.
     *
     * @param {string} text - The string to be rendered.
     * @param {Coordinate} coordinate - Normalized coordinates (0 to 1) within the HUD area.
     * @returns {void}
     */
    textOnHud(text: string, coordinate: Coordinate): void {
        const x = CoordinateHelper.getHudPosX(this._p, coordinate.x, this._rendererMetrics.display.width);
        const y = CoordinateHelper.getHudPosY(this._p, coordinate.y, this._rendererMetrics.display.height);

        this._p.text(text, x, y);
    }

    /**
     * Renders text on the main display area using relative coordinates.
     *
     * @param {string} text - The string to be rendered.
     * @param {Coordinate} coordinate - Normalized coordinates (0 to 1) within the display area.
     * @returns {void}
     */
    textOnDisplay(text: string, coordinate: Coordinate): void {
        const x = CoordinateHelper.getDisplayPosX(this._p, this._rendererMetrics.display.width, coordinate.x);
        const y = CoordinateHelper.getDisplayPosY(this._p, this._rendererMetrics.display.height, coordinate.y);

        this._p.text(text, x, y);
    }

    getDebugData(): Record<string, string | number | boolean> {
        return {
            current_font_family: this.defaultFontFamily,
            font_sizes_count: this.fontSizes.length,
        };
    }
}
