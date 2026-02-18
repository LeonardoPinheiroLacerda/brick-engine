import p5 from 'p5';
import configs from '../../../config/configs';

interface ButtonLayoutResponse {
    smallButtonContainer: p5.Element;
    mediumButtonContainer: p5.Element;
    largeButtonContainer: p5.Element;
    directionVerticalContainer: p5.Element;
    directionHorizontalContainer: p5.Element;
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
 *  - smallButtonContainer: For system buttons (Reset, Sound, etc.), uses `configs.selectors.viewElementIds.smallButtonContainer`.
 *  - mediumButtonContainer: For direction controls, uses `configs.selectors.viewElementIds.mediumButtonContainer`.
 *  - largeButtonContainer: For the main action button, uses `configs.selectors.viewElementIds.largeButtonContainer`.
 *  - directionVerticalContainer: For Up/Down buttons.
 *  - directionHorizontalContainer: For Left/Right buttons.
 */
export default function ButtonLayout(p: p5, container: p5.Element): ButtonLayoutResponse {
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.id(configs.selectors.viewElementIds.buttonContainer);

    const smallButtonContainer = p.createDiv();
    smallButtonContainer.parent(buttonContainer);
    smallButtonContainer.id(configs.selectors.viewElementIds.smallButtonContainer);

    const innerButtonContainer = p.createDiv();
    innerButtonContainer.parent(buttonContainer);
    innerButtonContainer.id(configs.selectors.viewElementIds.innerButtonContainer);

    const mediumButtonContainer = p.createDiv();
    mediumButtonContainer.parent(innerButtonContainer);
    mediumButtonContainer.id(configs.selectors.viewElementIds.mediumButtonContainer);

    const directionVerticalContainer = p.createDiv();
    directionVerticalContainer.parent(mediumButtonContainer);
    directionVerticalContainer.id(configs.selectors.viewElementIds.directionVerticalContainer);

    const directionHorizontalContainer = p.createDiv();
    directionHorizontalContainer.parent(mediumButtonContainer);
    directionHorizontalContainer.id(configs.selectors.viewElementIds.directionHorizontalContainer);

    const largeButtonContainer = p.createDiv();
    largeButtonContainer.parent(innerButtonContainer);
    largeButtonContainer.id(configs.selectors.viewElementIds.largeButtonContainer);

    return {
        smallButtonContainer,
        mediumButtonContainer,
        largeButtonContainer,
        directionVerticalContainer,
        directionHorizontalContainer,
    };
}
