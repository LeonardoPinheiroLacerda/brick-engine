import P5 from 'p5';

/**
 * Creates a small system button (e.g., Reset, Sound).
 *
 * These buttons have a distinct style and include a visible paragraph label next to them.
 *
 * @param {P5} p - The P5 instance.
 * @param {P5.Element} container - The container element to attach the button to.
 * @param {string} label - The visible text label displayed near the button.
 * @param {boolean} top - Determines position/styling nuance (e.g. if it belongs to the top row of small buttons).
 * @returns {P5.Element} The created button element.
 */
export default function SmallButton(p: P5, container: P5.Element, label: string, top: boolean) {
    //Container
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.addClass('sm-btn-container');
    buttonContainer.addClass(top ? 'sm-btn-container-top' : 'sm-btn-container-bottom');

    //Button
    const button = p.createButton('');
    button.parent(buttonContainer);
    button.addClass('sm-btn');

    //Label
    const paragraph = p.createP(label);
    paragraph.parent(buttonContainer);
    paragraph.addClass('sm-btn-p');

    return button;
}
