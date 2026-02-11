import P5 from 'p5';

export default function Frame(p: P5, container: P5.Element): P5.Element {
    const frame = p.createDiv();
    frame.parent(container);
    frame.id('frame');

    const div = p.createDiv();
    div.parent(frame);

    const paragraph = p.createP('Brick Game');
    paragraph.parent(div);

    return frame;
}
