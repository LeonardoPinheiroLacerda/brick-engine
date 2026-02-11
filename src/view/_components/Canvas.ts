import P5 from 'p5';

interface CanvasResponse {
    canvasWidth: number;
    canvasHeight: number;
    canvas: P5.Element;
}

export default function Canvas(
    p: P5,
    container: P5.Element,
    width: number,
): CanvasResponse {
    const canvasWidth = width * 0.7;
    const canvasHeight = canvasWidth * 1.114;

    const canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(container);
    canvas.id('brick-game-canvas');

    return { canvasWidth, canvasHeight, canvas };
}
