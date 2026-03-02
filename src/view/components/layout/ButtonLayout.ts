import p5 from 'p5';
import RendererContext from '../../../core/context/RendererContext';

interface ButtonLayoutResponse {
    smallButtonContainer: p5.Element;
    mediumButtonContainer: p5.Element;
    largeButtonContainer: p5.Element;
    directionVerticalContainer: p5.Element;
    directionHorizontalContainer: p5.Element;
    trackpadContainer: p5.Element;
}

/**
 * Creates and organizes the layout containers for game control buttons.
 *
 * It constructs a hierarchy of div elements to separate small system buttons,
 * inner group buttons, and directional pads.
 *
 * @param {p5} p - The p5 instance.
 * @param {p5.Element} container - The parent container element.
 * @returns {ButtonLayoutResponse} Object containing the button containers.
 *  - smallButtonContainer: For system buttons (Reset, Sound, etc.), uses ID `'small-button-container'`.
 *  - mediumButtonContainer: For direction controls, uses ID `'medium-button-container'`.
 *  - largeButtonContainer: For the main action button, uses ID `'large-button-container'`.
 *  - directionVerticalContainer: For Up/Down buttons.
 *  - directionHorizontalContainer: For Left/Right buttons.
 */
export default function ButtonLayout(container: p5.Element): ButtonLayoutResponse {
    const { p } = RendererContext;
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.id('button-container');

    const smallButtonContainer = p.createDiv();
    smallButtonContainer.parent(buttonContainer);
    smallButtonContainer.id('small-button-container');

    const innerButtonContainer = p.createDiv();
    innerButtonContainer.parent(buttonContainer);
    innerButtonContainer.id('inner-button-container');

    const mediumButtonContainer = p.createDiv();
    mediumButtonContainer.parent(innerButtonContainer);
    mediumButtonContainer.id('medium-button-container');

    const directionVerticalContainer = p.createDiv();
    directionVerticalContainer.parent(mediumButtonContainer);
    directionVerticalContainer.id('direction-vertical-container');

    const directionHorizontalContainer = p.createDiv();
    directionHorizontalContainer.parent(mediumButtonContainer);
    directionHorizontalContainer.id('direction-horizontal-container');

    const largeButtonContainer = p.createDiv();
    largeButtonContainer.parent(innerButtonContainer);
    largeButtonContainer.id('large-button-container');

    const trackpadContainer = p.createDiv();
    trackpadContainer.parent(innerButtonContainer);
    trackpadContainer.id('trackpad-container');

    return {
        smallButtonContainer,
        mediumButtonContainer,
        largeButtonContainer,
        directionVerticalContainer,
        directionHorizontalContainer,
        trackpadContainer,
    };
}
