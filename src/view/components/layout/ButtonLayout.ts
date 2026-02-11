import P5 from 'p5';

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
 *  - smallButtonContainer: For system buttons (Reset, Sound, etc.).
 *  - mediumButtonContainer: For direction controls.
 *  - largeButtonContainer: For the main action button.
 *  - directionVerticalContainer: For Up/Down buttons.
 *  - directionHorizontalContainer: For Left/Right buttons.
 */
export default function ButtonLayout(p: P5, container: P5.Element): ButtonLayoutResponse {
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

    return {
        smallButtonContainer,
        mediumButtonContainer,
        largeButtonContainer,
        directionVerticalContainer,
        directionHorizontalContainer,
    };
}
