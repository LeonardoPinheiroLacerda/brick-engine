import P5 from 'p5';

export default function ButtonContainers(p: P5, container: P5.Element) {
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
