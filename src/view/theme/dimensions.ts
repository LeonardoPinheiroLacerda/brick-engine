import { SHADOW_DISPERSION } from '../../constants';

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

    root.style.setProperty('--dispersion'                        , SHADOW_DISPERSION);

    root.style.setProperty('--width'                             , `${width}px`);
    root.style.setProperty('--height'                            , `${height}px`);

    root.style.setProperty('--canvas-width'                      , `${canvasWidth}px`);
    root.style.setProperty('--canvas-height'                     , `${canvasHeight}px`);

    root.style.setProperty('--border-radius'                     , `${width * 0.05}px`);
    root.style.setProperty('--border'                            , `${width * 0.006}px solid black`);

    root.style.setProperty('--sm-button-size'                    , `${width * 0.08}px`);
    root.style.setProperty('--button-size'                       , `${width * 0.18}px`);
    root.style.setProperty('--lg-button-size'                    , `${width * 0.25}px`);

    root.style.setProperty('--sm-button-size-mobile'             , `${width * 0.13}px`);
    root.style.setProperty('--button-size-mobile'                , `${width * 0.26}px`);
    root.style.setProperty('--lg-button-size-mobile'             , `${width * 0.35}px`);

    root.style.setProperty('--sm-button-size-mobile-font-size'   , `${width * 0.04}px`);
    root.style.setProperty('--sm-button-size-mobile-line-height' , `${width * 0.04}px`);

    root.style.setProperty('--button-size-mobile-font-size'      , `${width * 0.05}px`);
    root.style.setProperty('--lg-button-size-mobile-font-size'   , `${width * 0.055}px`);

    root.style.setProperty('--button-size-mobile-spacing'        , `${width * 0.018}px`);

    root.style.setProperty('--button-border'                     , `${width * 0.0045}px solid black`);
    root.style.setProperty('--button-animation-duration'         , `0.15s`);
}
