import p5 from 'p5';
import configs from '../../../config/configs';

/**
 * Response object containing container dimensions and element reference.
 */
interface ContainerResponse {
    width: number;
    height: number;
    container: p5.Element;
}

/**
 * Creates the main game container and calculates its optimal dimensions.
 *
 * It ensures the game container fits within the parent element (usually the window or a specific div)
 * while maintaining a fixed aspect ratio defined by `configs.viewLayout.bodyHeightWidthMultiplier`.
 * On smaller screens (<= configs.viewLayout.mobileBreakpoint width), it attempts to fill the parent width.
 * On larger screens, it calculates the maximum dimensions that fit without overflowing vertically.
 *
 * @param {p5} p - The p5 instance.
 * @param {HTMLElement} parent - The DOM element where the container will be appended.
 * @returns {ContainerResponse} Object containing the container element and its calculated width/height.
 */
export default function ContainerLayout(p: p5, parent: HTMLElement): ContainerResponse {
    const container = p.createDiv();
    container.parent(configs.selectors.parent);
    container.id(configs.selectors.viewElementIds.container);

    let width: number;
    let height: number;

    if (parent.clientWidth <= configs.viewLayout.mobileBreakpoint) {
        width = parent.clientWidth;
        height = parent.clientHeight;

        return { container, width, height };
    }

    // Calcula a largura máxima baseada na altura disponível
    const maxHeightWidth = parent.clientHeight / (configs.viewLayout.bodyHeightWidthMultiplier * 1.05);

    // A largura final é o menor valor entre a largura disponível e a largura limitada pela altura
    width = Math.min(parent.clientWidth, maxHeightWidth);

    // A altura é calculada com base na proporção original
    height = width * configs.viewLayout.bodyHeightWidthMultiplier;

    return { container, width, height };
}
