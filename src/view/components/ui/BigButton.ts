import p5 from 'p5';

/**
 * Creates the large action button.
 *
 * This button is typically used for the primary game action (e.g., rotate, fire).
 * It creates a specific container and applies large button styles.
 *
 * @param p - The p5 instance.
 * @param container - The container element to attach the button to.
 * @param label - The text label for the button (currently used for aria-label or internal logic as visual label is commented out).
 * @returns The created button element.
 */
export default function BigButton(p: p5, container: p5.Element, label: string) {
    //Container
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.addClass('lg-btn-container');

    // //Label
    // const paragraph = p.createP(label);
    // paragraph.parent(buttonContainer);
    // paragraph.addClass('lg-btn-p');

    //Button
    const button = p.createButton(label);
    button.parent(buttonContainer);
    button.addClass('lg-btn');

    return button;
}
