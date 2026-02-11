import P5 from 'p5';

import { LAYOUT } from '../../../config/layout';
import { SELECTORS } from '../../../config/selectors';

/**
 * Response object containing canvas dimensions and element reference.
 */
interface CanvasResponse {
    canvasWidth: number;
    canvasHeight: number;
    canvas: P5.Element;
}

/**
 * Creates the main P5 canvas for rendering the game.
 *
 * It calculates the canvas size based on the provided container width, maintaining a specific aspect ratio
 * defined by `LAYOUT.CANVAS.ASPECT_RATIO`.
 *
 * @param {P5} p - The P5 instance.
 * @param {P5.Element} container - The frame container to attach the canvas to.
 * @param {number} width - The width of the outer container, used to calculate canvas dimensions with `LAYOUT.CANVAS.WIDTH_RATIO`.
 * @returns {CanvasResponse} Object containing the canvas element and its calculated dimensions.
 */
export default function Canvas(
    p: P5,
    container: P5.Element,
    width: number,
): CanvasResponse {
    const canvasWidth = width * LAYOUT.CANVAS.WIDTH_RATIO;
    const canvasHeight = canvasWidth * LAYOUT.CANVAS.ASPECT_RATIO;

    const canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(container);
    canvas.id(SELECTORS.VIEW_ELEMENT_IDS.CANVAS);

    return { canvasWidth, canvasHeight, canvas };
}
