import P5 from 'p5';

/**
 * Creates a standard directional button.
 *
 * These buttons are used for the D-pad controls (Up, Down, Left, Right).
 *
 * @param p - The P5 instance.
 * @param container - The container element to attach the button to.
 * @param label - The text label for the button.
 * @returns The created button element.
 */
export default function Button(p: P5, container: P5.Element, label: string) {
    //Container
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.addClass('btn-container');

    //Button
    const button = p.createButton(label);
    button.parent(buttonContainer);
    button.addClass('btn');

    //Label
    // const paragraph = p.createP(label);
    // paragraph.parent(buttonContainer);
    // paragraph.addClass('btn-p');

    return button;
}
