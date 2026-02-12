import P5 from 'p5';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import configs from '../../../config/configs';
import FontSize from '../../enum/FontSize';
import FontAlign from '../../enum/FontAlign';
import Coordinate from '../../interface/Coordinate';
import { DisplayMetrics } from '../renderer/GameRenderer';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import FontVerticalAlign from '../../enum/FontVerticalAlign';

/**
 * Handles text rendering and font management within the game.
 *
 * This class orchestrates font initialization, sizing, alignment, and
 * provides methods to render text on specific areas (HUD or Display).
 */
export default class GameText {
    /** The default font family used for game text. */
    protected defaultFontFamily: string = 'retro-gamming';

    /** Array containing pre-calculated font sizes in pixels. */
    private fontSizes: number[] = [0];

    /** Stores the current display metrics for relative positioning. */
    private _displayMetrics: DisplayMetrics;

    /** The P5 instance used for rendering. */
    private _p: P5;

    /**
     * Creates an instance of GameTexts.
     *
     * @param {P5} p - The P5 instance.
     */
    constructor(p: P5) {
        this._p = p;
    }

    /**
     * Initializes the font and pre-calculates relative font sizes.
     *
     * Uses configuration values to define a set of pixel-perfect font sizes
     * based on current container width.
     *
     * @returns {void}
     */
    defineFont(): void {
        const { extraSmall, small, medium, large, extraLarge } = configs.screenLayout.fontSize;

        this._p.textFont(this.defaultFontFamily);

        //Define o tamanho das fontes
        this.fontSizes = [];

        this.fontSizes.push(RelativeValuesHelper.getRelativeWidth(this._p, extraSmall));
        this.fontSizes.push(RelativeValuesHelper.getRelativeWidth(this._p, small));
        this.fontSizes.push(RelativeValuesHelper.getRelativeWidth(this._p, medium));
        this.fontSizes.push(RelativeValuesHelper.getRelativeWidth(this._p, large));
        this.fontSizes.push(RelativeValuesHelper.getRelativeWidth(this._p, extraLarge));
    }

    /**
     * Sets the display metrics used for relative text positioning.
     *
     * @param {DisplayMetrics} displayMetrics - The current display dimensions and origin.
     * @returns {void}
     */
    defineDisplayMetrics(displayMetrics: DisplayMetrics): void {
        this._displayMetrics = displayMetrics;
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
        const x = CoordinateHelper.getHudPosX(this._p, coordinate.x, this._displayMetrics.displayWidth);
        const y = CoordinateHelper.getHudPosY(this._p, coordinate.y, this._displayMetrics.displayHeight);

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
        const x = CoordinateHelper.getDisplayPosX(this._p, this._displayMetrics.displayWidth, coordinate.x);
        const y = CoordinateHelper.getDisplayPosY(this._p, this._displayMetrics.displayHeight, coordinate.y);

        this._p.text(text, x, y);
    }
}
