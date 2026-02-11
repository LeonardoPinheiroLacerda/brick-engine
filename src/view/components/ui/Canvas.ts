import P5 from 'p5';

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
 * It calculates the canvas size based on the provided container width, maintaining a specific aspect ratio.
 *
 * @param {P5} p - The P5 instance.
 * @param {P5.Element} container - The frame container to attach the canvas to.
 * @param {number} width - The width of the outer container, used to calculate canvas dimensions.
 * @returns {CanvasResponse} Object containing the canvas element and its calculated dimensions.
 */
export default function Canvas(p: P5, container: P5.Element, width: number): CanvasResponse {
    const canvasWidth = width * 0.7;
    const canvasHeight = canvasWidth * 1.114;

    const canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(container);
    canvas.id('brick-game-canvas');

    return { canvasWidth, canvasHeight, canvas };
}
