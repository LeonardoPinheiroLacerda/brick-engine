import { colord } from 'colord';

import { MAIN_COLOR_QUERY_PARAM, BUTTON_COLOR_QUERY_PARAM, BODY_MAIN_COLOR, BODY_BUTTON_COLOR } from '../../constants';

// prettier-ignore
/**
 * Applies color themes to the application by setting CSS variables.
 *
 * It checks for "mainColor" and "buttonColor" query parameters in the URL.
 * If present, these values are used; otherwise, default constants are applied.
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

    const mainColor = searchParams.has(MAIN_COLOR_QUERY_PARAM)
        ? searchParams.get(MAIN_COLOR_QUERY_PARAM)
        : BODY_MAIN_COLOR;

    const buttonColor = searchParams.has(BUTTON_COLOR_QUERY_PARAM)
        ? searchParams.get(BUTTON_COLOR_QUERY_PARAM)
        : BODY_BUTTON_COLOR;

    root.style.setProperty('--main-color'            , mainColor);
    root.style.setProperty('--button-color'          , buttonColor);

    root.style.setProperty('--color-shadow'          , colord(mainColor)  .darken(0.15).toHex());
    root.style.setProperty('--color-shadow-reflexion', colord(mainColor)  .lighten(0.15).toHex());
    root.style.setProperty('--button-color-reflexion', colord(buttonColor).lighten(0.15).toHex());
    root.style.setProperty('--button-color-shadow'   , colord(buttonColor).darken(0.15).toHex());
}
