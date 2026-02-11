import P5 from 'p5';
import { BODY_HEIGHT_WIDTH_MULTIPLIER, PARENT_SELECTOR } from '../../constants';

interface ContainerResponse {
    width: number;
    height: number;
    container: P5.Element;
}

export default function Container(
    p: P5,
    parent: HTMLElement,
): ContainerResponse {
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

    let percentage = 100;

    do {
        width = parent.clientWidth * (percentage / 100);

        height = width * BODY_HEIGHT_WIDTH_MULTIPLIER;
        percentage -= 1;
    } while (height * 1.05 > parent.clientHeight);
    //TODO: encontrar uma forma melhor de fazer isso

    return { container, width, height };
}
