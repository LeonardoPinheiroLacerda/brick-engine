import { COLORS } from '../../config/colors';
import { THEME } from '../../config/theme';
import { LAYOUT } from '../../config/layout';

// prettier-ignore
/**
 * Calculates and sets various CSS variables for responsive sizing of the game UI.
 *
 * This function defines sizes for the main container, canvas, borders, buttons (including mobile variations),
 * and fonts based on the provided dimensions.
 *
 * @param width - The width of the game container.
 * @param height - The height of the game container.
 * @param canvasWidth - The width of the game canvas.
 * @param canvasHeight - The height of the game canvas.
 * @returns
 */
export default function dimensions(
    width: number,
    height: number,
    canvasWidth: number,
    canvasHeight: number,
) {
    const root: HTMLElement = document.querySelector(':root');

    root.style.setProperty('--dispersion'                        , LAYOUT.SHADOW_DISPERSION);

    root.style.setProperty('--width'                             , `${width}px`);
    root.style.setProperty('--height'                            , `${height}px`);

    root.style.setProperty('--canvas-width'                      , `${canvasWidth}px`);
    root.style.setProperty('--canvas-height'                     , `${canvasHeight}px`);

    root.style.setProperty('--border-radius'                     , `${width * THEME.DIMENSIONS.BORDER_RADIUS_RATIO}px`);
    root.style.setProperty('--border'                            , `${width * THEME.DIMENSIONS.BORDER_WIDTH_RATIO}px solid black`);

    root.style.setProperty('--sm-button-size'                    , `${width * THEME.DIMENSIONS.BUTTON.SM_SIZE_RATIO}px`);
    root.style.setProperty('--button-size'                       , `${width * THEME.DIMENSIONS.BUTTON.MD_SIZE_RATIO}px`);
    root.style.setProperty('--lg-button-size'                    , `${width * THEME.DIMENSIONS.BUTTON.LG_SIZE_RATIO}px`);

    root.style.setProperty('--sm-button-size-mobile'             , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.SM_SIZE_RATIO}px`);
    root.style.setProperty('--button-size-mobile'                , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.MD_SIZE_RATIO}px`);
    root.style.setProperty('--lg-button-size-mobile'             , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.LG_SIZE_RATIO}px`);

    root.style.setProperty('--sm-button-size-mobile-font-size'   , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.SM_FONT_RATIO}px`);
    root.style.setProperty('--sm-button-size-mobile-line-height' , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.SM_FONT_RATIO}px`);

    root.style.setProperty('--button-size-mobile-font-size'      , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.FONT_RATIO}px`);
    root.style.setProperty('--lg-button-size-mobile-font-size'   , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.LG_FONT_RATIO}px`);

    root.style.setProperty('--button-size-mobile-spacing'        , `${width * THEME.DIMENSIONS.BUTTON.MOBILE.SPACING_RATIO}px`);

    root.style.setProperty('--button-border'                     , `${width * THEME.DIMENSIONS.BUTTON.BORDER_RATIO}px solid black`);
    root.style.setProperty('--button-animation-duration'         , THEME.DIMENSIONS.BUTTON.ANIMATION_DURATION);
}
