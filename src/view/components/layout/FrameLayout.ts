import p5 from 'p5';
import configs from '../../../config/configs';

/**
 * Creates the decorative frame for the game.
 *
 * Adds a visual frame around the game area and includes the branding text "Brick Game".
 *
 * @param p - The p5 instance.
 * @param container - The parent container element.
 * @returns The created frame element.
 */
export default function FrameLayout(p: p5, container: p5.Element): p5.Element {
    const frame = p.createDiv();
    frame.parent(container);
    frame.id(configs.selectors.viewElementIds.frame);

    const div = p.createDiv();
    div.parent(frame);

    const paragraph = p.createP('Brick Game');
    paragraph.parent(div);

    return frame;
}
