import p5 from 'p5';

import configs from '../../../config/configs';

/**
 * Response object containing canvas dimensions and element reference.
 */
interface CanvasResponse {
    canvasWidth: number;
    canvasHeight: number;
    canvas: p5.Element;
}

/**
 * Creates the main p5 canvas for rendering the game.
 *
 * It calculates the canvas size based on the provided container width, maintaining a specific aspect ratio
 * defined by `configs.viewLayout.canvas.aspectRatio`.
 *
 * @param {p5} p - The p5 instance.
 * @param {p5.Element} container - The frame container to attach the canvas to.
 * @param {number} width - The width of the outer container, used to calculate canvas dimensions with `configs.viewLayout.canvas.widthRatio`.
 * @returns {CanvasResponse} Object containing the canvas element and its calculated dimensions.
 */
export default function Canvas(p: p5, container: p5.Element, width: number): CanvasResponse {
    const canvasWidth = width * configs.viewLayout.canvas.widthRatio;
    const canvasHeight = canvasWidth * configs.viewLayout.canvas.aspectRatio;

    const canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(container);
    canvas.id(configs.selectors.viewElementIds.canvas);

    return { canvasWidth, canvasHeight, canvas };
}
