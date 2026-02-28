import configs from '../../../config/configs';
import { FontSize, FontAlign, FontVerticalAlign } from '../../types/enums';
import { Coordinate, RendererMetrics } from '../../types/Types';
import { Debuggable } from '../../types/Interfaces';
import CoordinateHelper from '../../helpers/CoordinateHelper';
import RelativeValuesHelper from '../../helpers/RelativeValuesHelper';
import { Text } from '../../types/modules';
import RendererContext from '../../context/RendererContext';

/**
 * Core text rendering module bridging engine abstractions to specific pixel scaling.
 *
 * Implements the {@link Text} interface to separate font computation logic from
 * actual grid and view rendering processes. By pre-calculating relative font dimensions
 * and actively calculating spatial positions against the display canvas at runtime, it
 * guarantees that all text objects are purely responsive without causing continuous layout
 * recalculations on the primary engine CPU loop.
 */
export default class GameText implements Text, Debuggable {
    /** The default font family used for game text. */
    protected defaultFontFamily: string = 'retro-gamming';

    /** Array containing pre-calculated font sizes in pixels. */
    private fontSizes: number[] = [0];

    /** Stores the current display metrics for relative positioning. */
    private _rendererMetrics: RendererMetrics;

    // prettier-ignore
    /**
     * Setups the active font-family and pre-calculates the array of relative font sizes.
     *
     * Extracts values from the local environment to pre-define deterministic font scales
     * based on the container width to eliminate parsing loops later.
     *
     * @returns {void} Returns nothing.
     */
    setup(): void {
        const { p } = RendererContext;
        const { extraSmall, small, medium, large, extraLarge } = configs.screenLayout.fontSize;

        p.textFont(this.defaultFontFamily);

        // Define font sizes
        this.fontSizes = [];

        this.fontSizes[FontSize.EXTRA_SMALL] = RelativeValuesHelper.getRelativeWidth(extraSmall);
        this.fontSizes[FontSize.SMALL]       = RelativeValuesHelper.getRelativeWidth(small);
        this.fontSizes[FontSize.MEDIUM]      = RelativeValuesHelper.getRelativeWidth(medium);
        this.fontSizes[FontSize.LARGE]       = RelativeValuesHelper.getRelativeWidth(large);
        this.fontSizes[FontSize.EXTRA_LARGE] = RelativeValuesHelper.getRelativeWidth(extraLarge);
    }

    /**
     * Injects the active bounding box metrics used for relative text alignments.
     *
     * @param {RendererMetrics} rendererMetrics - The extracted immutable origin definitions.
     * @returns {void} Returns nothing.
     */
    setRendererMetrics(rendererMetrics: RendererMetrics): void {
        this._rendererMetrics = rendererMetrics;
    }

    /**
     * Internal utility method swapping the drawing context paint buckets directly.
     *
     * @param {boolean} state - Flag evaluating to true for active and false for inactive coloring themes.
     * @returns {void} Returns nothing.
     */
    protected setTextState(state: boolean): void {
        const { p } = RendererContext;
        const { active, inactive } = configs.colors;
        p.fill(state ? active : inactive);
    }

    /**
     * Sets the context canvas text stroke/fill strictly to the active color theme.
     *
     * @returns {void} Returns nothing.
     */
    setActiveText(): void {
        this.setTextState(true);
    }

    /**
     * Sets the context canvas text stroke/fill strictly to the inactive/faded color theme.
     *
     * @returns {void} Returns nothing.
     */
    setInactiveText(): void {
        this.setTextState(false);
    }

    /**
     * Assigns the drawing bounds scalar based on pre-compiled values.
     *
     * @param {FontSize} fontSize - The enum target corresponding to an active dictionary size entry.
     * @returns {void} Returns nothing.
     */
    setTextSize(fontSize: FontSize): void {
        const { p } = RendererContext;
        p.textSize(this.fontSizes[fontSize]);
    }

    /**
     * Direct wrapper defining the geometric justification rules inside a bounded region.
     *
     * @param {FontAlign} fontAlign - Horizontal alignment orientation vector.
     * @param {FontVerticalAlign} fontVerticalAlign - Vertical alignment position plane.
     * @returns {void} Returns nothing.
     */
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void {
        const { p } = RendererContext;
        p.textAlign(fontAlign, fontVerticalAlign);
    }

    /**
     * Calculates relative coordinates and natively projects text bounds towards the HUD zone.
     *
     * @param {string} text - The raw formatted string.
     * @param {Coordinate} coordinate - Float coordinate vectors from 0.0 to 1.0 restricted to the HUD bounds.
     * @returns {void} Returns nothing.
     */
    textOnHud(text: string, coordinate: Coordinate): void {
        const { p } = RendererContext;
        const x = CoordinateHelper.getHudPosX(coordinate.x, this._rendererMetrics.display.width);
        const y = CoordinateHelper.getHudPosY(coordinate.y, this._rendererMetrics.display.height);

        p.text(text, x, y);
    }

    /**
     * Calculates relative coordinates and natively projects text bounds towards the Main Display zone.
     *
     * @param {string} text - The raw formatted string sequence.
     * @param {Coordinate} coordinate - Float coordinate vectors from 0.0 to 1.0 referencing the Main Display bounds.
     * @returns {void} Returns nothing.
     */
    textOnDisplay(text: string, coordinate: Coordinate): void {
        const { p } = RendererContext;
        // Fixed argument order: (p, x, displayWidth)
        const x = CoordinateHelper.getDisplayPosX(coordinate.x, this._rendererMetrics.display.width);
        const y = CoordinateHelper.getDisplayPosY(coordinate.y, this._rendererMetrics.display.height);

        p.text(text, x, y);
    }

    /**
     * Aggregates configuration details requested by the engine's Debugging Dashboard hook.
     *
     * @returns {Record<string, string | number | boolean>} A shallow payload of visual metrics dictating memory cache state.
     */
    getDebugData(): Record<string, string | number | boolean> {
        return {
            current_font_family: this.defaultFontFamily,
            font_sizes_count: this.fontSizes.length,
        };
    }
}
