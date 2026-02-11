import configs from '../../config/configs';

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

    root.style.setProperty('--dispersion'                        , configs.viewLayout.shadowDispersion);

    root.style.setProperty('--width'                             , `${width}px`);
    root.style.setProperty('--height'                            , `${height}px`);

    root.style.setProperty('--canvas-width'                      , `${canvasWidth}px`);
    root.style.setProperty('--canvas-height'                     , `${canvasHeight}px`);

    root.style.setProperty('--border-radius'                     , `${width * configs.viewLayout.dimensions.borderRadiusRatio}px`);
    root.style.setProperty('--border'                            , `${width * configs.viewLayout.dimensions.borderWidthRatio}px solid black`);

    root.style.setProperty('--sm-button-size'                    , `${width * configs.viewLayout.dimensions.button.smSizeRatio}px`);
    root.style.setProperty('--button-size'                       , `${width * configs.viewLayout.dimensions.button.mdSizeRatio}px`);
    root.style.setProperty('--lg-button-size'                    , `${width * configs.viewLayout.dimensions.button.lgSizeRatio}px`);

    root.style.setProperty('--sm-button-size-mobile'             , `${width * configs.viewLayout.dimensions.button.mobile.smSizeRatio}px`);
    root.style.setProperty('--button-size-mobile'                , `${width * configs.viewLayout.dimensions.button.mobile.mdSizeRatio}px`);
    root.style.setProperty('--lg-button-size-mobile'             , `${width * configs.viewLayout.dimensions.button.mobile.lgSizeRatio}px`);

    root.style.setProperty('--sm-button-size-mobile-font-size'   , `${width * configs.viewLayout.dimensions.button.mobile.smFontRatio}px`);
    root.style.setProperty('--sm-button-size-mobile-line-height' , `${width * configs.viewLayout.dimensions.button.mobile.smFontRatio}px`);

    root.style.setProperty('--button-size-mobile-font-size'      , `${width * configs.viewLayout.dimensions.button.mobile.fontRatio}px`);
    root.style.setProperty('--lg-button-size-mobile-font-size'   , `${width * configs.viewLayout.dimensions.button.mobile.lgFontRatio}px`);

    root.style.setProperty('--button-size-mobile-spacing'        , `${width * configs.viewLayout.dimensions.button.mobile.spacingRatio}px`);

    root.style.setProperty('--button-border'                     , `${width * configs.viewLayout.dimensions.button.borderRatio}px solid black`);
    root.style.setProperty('--button-animation-duration'         , configs.viewLayout.dimensions.button.animationDuration);
}
