import P5 from 'p5';
import { BODY_HEIGHT_WIDTH_MULTIPLIER, PARENT_SELECTOR } from '../../../constants';

/**
 * Response object containing container dimensions and element reference.
 */
interface ContainerResponse {
    width: number;
    height: number;
    container: P5.Element;
}

/**
 * Creates the main game container and calculates its optimal dimensions.
 *
 * It ensures the game container fits within the parent element (usually the window or a specific div)
 * while maintaining a fixed aspect ratio defined by `BODY_HEIGHT_WIDTH_MULTIPLIER`.
 * On smaller screens (<= 600px width), it attempts to fill the parent width.
 * On larger screens, it calculates the maximum dimensions that fit without overflowing vertically.
 *
 * @param {P5} p - The P5 instance.
 * @param {HTMLElement} parent - The DOM element where the container will be appended.
 * @returns {ContainerResponse} Object containing the container element and its calculated width/height.
 */
export default function ContainerLayout(p: P5, parent: HTMLElement): ContainerResponse {
    const container = p.createDiv();
    container.parent(PARENT_SELECTOR);
    container.id('container');

    let width: number;
    let height: number;

    if (parent.clientWidth <= 600) {
        width = parent.clientWidth;
        height = parent.clientHeight;

        return { container, width, height };
    }

    // Calcula a largura máxima baseada na altura disponível
    const maxHeightWidth = parent.clientHeight / (BODY_HEIGHT_WIDTH_MULTIPLIER * 1.05);

    // A largura final é o menor valor entre a largura disponível e a largura limitada pela altura
    width = Math.min(parent.clientWidth, maxHeightWidth);

    // A altura é calculada com base na proporção original
    height = width * BODY_HEIGHT_WIDTH_MULTIPLIER;

    return { container, width, height };
}
