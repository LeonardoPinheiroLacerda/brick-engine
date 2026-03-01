import p5 from 'p5';
import configs from '../../../config/configs';
import RendererContext from '../../../core/context/RendererContext';

/**
 * Creates the decorative frame for the game.
 *
 * Adds a visual frame around the game area and includes the branding text "Brick Engine".
 *
 * @param p - The p5 instance.
 * @param container - The parent container element.
 * @returns The created frame element.
 */
export default function FrameLayout(container: p5.Element): p5.Element {
    const { p } = RendererContext;
    const frame = p.createDiv();
    frame.parent(container);
    frame.id(configs.selectors.viewElementIds.frame);

    const div = p.createDiv();
    div.parent(frame);

    const paragraph = p.createP('Brick Engine');
    paragraph.parent(div);

    return frame;
}
