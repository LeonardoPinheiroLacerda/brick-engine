import { colord } from 'colord';

import { PARAMS } from '../../config/params';
import { COLORS } from '../../config/colors';

// prettier-ignore
/**
 * Applies color themes to the application by setting CSS variables.
 *
 * It checks for `PARAMS.MAIN_COLOR` and `PARAMS.BUTTON_COLOR` query parameters in the URL.
 * If present, these values are used; otherwise, default `COLORS` are applied.
 * It also calculates and sets shadow and reflection variations for these colors.
 *
 * @returns {void}
 */
export default function applyColors() {
    const root: HTMLElement = document.querySelector(':root');

    const paramsString = window.location.href.substring(
        window.location.href.indexOf('?') + 1,
    );
    const searchParams = new URLSearchParams(paramsString);

    const mainColor = searchParams.has(PARAMS.MAIN_COLOR)
        ? searchParams.get(PARAMS.MAIN_COLOR)
        : COLORS.BODY_MAIN;

    const buttonColor = searchParams.has(PARAMS.BUTTON_COLOR)
        ? searchParams.get(PARAMS.BUTTON_COLOR)
        : COLORS.BODY_BUTTON;

    root.style.setProperty('--main-color'            , mainColor);
    root.style.setProperty('--button-color'          , buttonColor);

    root.style.setProperty('--color-shadow'          , colord(mainColor)  .darken(0.15).toHex());
    root.style.setProperty('--color-shadow-reflexion', colord(mainColor)  .lighten(0.15).toHex());
    root.style.setProperty('--button-color-reflexion', colord(buttonColor).lighten(0.15).toHex());
    root.style.setProperty('--button-color-shadow'   , colord(buttonColor).darken(0.15).toHex());
}
