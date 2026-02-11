import P5 from 'p5';

export default function BigButton(p: P5, container: P5.Element, label: string) {
    //Container
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.addClass('lg-btn-container');

    // //Label
    // const paragraph = p.createP(label);
    // paragraph.parent(buttonContainer);
    // paragraph.addClass('lg-btn-p');

    //Button
    const button = p.createButton(label);
    button.parent(buttonContainer);
    button.addClass('lg-btn');

    return button;
}
