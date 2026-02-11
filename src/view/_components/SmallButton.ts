import P5 from 'p5';

export default function SmallButton(p: P5, container: P5.Element, label: string, top: boolean) {
    //Container
    const buttonContainer = p.createDiv();
    buttonContainer.parent(container);
    buttonContainer.addClass('sm-btn-container');
    buttonContainer.addClass(top ? 'sm-btn-container-top' : 'sm-btn-container-bottom');

    //Button
    const button = p.createButton('');
    button.parent(buttonContainer);
    button.addClass('sm-btn');

    //Label
    const paragraph = p.createP(label);
    paragraph.parent(buttonContainer);
    paragraph.addClass('sm-btn-p');

    return button;
}
