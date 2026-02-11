import P5 from 'p5';
import { SELECTORS } from '../../../config/selectors';

/**
 * Creates the decorative frame for the game.
 *
 * Adds a visual frame around the game area and includes the branding text "Brick Game".
 *
 * @param p - The P5 instance.
 * @param container - The parent container element.
 * @returns The created frame element.
 */
export default function FrameLayout(p: P5, container: P5.Element): P5.Element {
    const frame = p.createDiv();
    frame.parent(container);
    frame.id(SELECTORS.VIEW_ELEMENT_IDS.FRAME);

    const div = p.createDiv();
    div.parent(frame);

    const paragraph = p.createP('Brick Game');
    paragraph.parent(div);

    return frame;
}
