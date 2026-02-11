import P5 from 'p5';
import { SELECTORS } from '../../../config/selectors';

interface ButtonLayoutResponse {
    smallButtonContainer: P5.Element;
    mediumButtonContainer: P5.Element;
    largeButtonContainer: P5.Element;
    directionVerticalContainer: P5.Element;
    directionHorizontalContainer: P5.Element;
}

/**
 * Creates and organizes the layout containers for game control buttons.
 *
 * It constructs a hierarchy of div elements to separate small system buttons,
 * inner group buttons, and directional pads.
 *
 * @param {P5} p - The P5 instance.
 * @param {P5.Element} container - The parent container element.
 * @returns {ButtonLayoutResponse} Object containing the button containers.
 *  - smallButtonContainer: For system buttons (Reset, Sound, etc.), uses `SELECTORS.VIEW_ELEMENT_IDS.SMALL_BUTTON_CONTAINER`.
 *  - mediumButtonContainer: For direction controls, uses `SELECTORS.VIEW_ELEMENT_IDS.MEDIUM_BUTTON_CONTAINER`.
 *  - largeButtonContainer: For the main action button, uses `SELECTORS.VIEW_ELEMENT_IDS.LARGE_BUTTON_CONTAINER`.
 *  - directionVerticalContainer: For Up/Down buttons.
 *  - directionHorizontalContainer: For Left/Right buttons.
 */
export default function ButtonLayout(
    p: P5,
    container: P5.Element,
): ButtonLayoutResponse {
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.id(SELECTORS.VIEW_ELEMENT_IDS.BUTTON_CONTAINER);

    const smallButtonContainer = p.createDiv();
    smallButtonContainer.parent(buttonContainer);
    smallButtonContainer.id(SELECTORS.VIEW_ELEMENT_IDS.SMALL_BUTTON_CONTAINER);

    const innerButtonContainer = p.createDiv();
    innerButtonContainer.parent(buttonContainer);
    innerButtonContainer.id(SELECTORS.VIEW_ELEMENT_IDS.INNER_BUTTON_CONTAINER);

    const mediumButtonContainer = p.createDiv();
    mediumButtonContainer.parent(innerButtonContainer);
    mediumButtonContainer.id(
        SELECTORS.VIEW_ELEMENT_IDS.MEDIUM_BUTTON_CONTAINER,
    );

    const directionVerticalContainer = p.createDiv();
    directionVerticalContainer.parent(mediumButtonContainer);
    directionVerticalContainer.id(
        SELECTORS.VIEW_ELEMENT_IDS.DIRECTION_VERTICAL_CONTAINER,
    );

    const directionHorizontalContainer = p.createDiv();
    directionHorizontalContainer.parent(mediumButtonContainer);
    directionHorizontalContainer.id(
        SELECTORS.VIEW_ELEMENT_IDS.DIRECTION_HORIZONTAL_CONTAINER,
    );

    const largeButtonContainer = p.createDiv();
    largeButtonContainer.parent(innerButtonContainer);
    largeButtonContainer.id(SELECTORS.VIEW_ELEMENT_IDS.LARGE_BUTTON_CONTAINER);

    return {
        smallButtonContainer,
        mediumButtonContainer,
        largeButtonContainer,
        directionVerticalContainer,
        directionHorizontalContainer,
    };
}
