import { colord } from 'colord';

import configs from '../../config/configs';

// prettier-ignore
/**
 * Applies color themes to the application by setting CSS variables.
 *
 * It checks for `configs.inputQueryParams.mainColor` and `configs.inputQueryParams.buttonColor` query parameters in the URL.
 * If present, these values are used; otherwise, default `configs.colors` are applied.
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

    const mainColor = searchParams.has(configs.inputQueryParams.mainColor)
        ? searchParams.get(configs.inputQueryParams.mainColor)
        : configs.colors.bodyMain;

    const buttonColor = searchParams.has(configs.inputQueryParams.buttonColor)
        ? searchParams.get(configs.inputQueryParams.buttonColor)
        : configs.colors.bodyButton;

    root.style.setProperty('--main-color'            , mainColor);
    root.style.setProperty('--button-color'          , buttonColor);

    root.style.setProperty('--color-shadow'          , colord(mainColor)  .darken(0.15).toHex());
    root.style.setProperty('--color-shadow-reflexion', colord(mainColor)  .lighten(0.15).toHex());
    root.style.setProperty('--button-color-reflexion', colord(buttonColor).lighten(0.15).toHex());
    root.style.setProperty('--button-color-shadow'   , colord(buttonColor).darken(0.15).toHex());
}
