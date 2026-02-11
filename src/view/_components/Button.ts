import P5 from 'p5';

export default function Button(p: P5, container: P5.Element, label: string) {
    //Container
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.addClass('btn-container');

    //Button
    const button = p.createButton(label);
    button.parent(buttonContainer);
    button.addClass('btn');

    //Label
    // const paragraph = p.createP(label);
    // paragraph.parent(buttonContainer);
    // paragraph.addClass('btn-p');

    return button;
}
