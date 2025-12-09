import { fireEvent, render } from '@testing-library/react';
import Button from './Button';

describe('Common components - Button', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<Button cssClass="primary" />);

    expect(baseElement).toBeTruthy();
  });

  it('Should check title ', () => {
    const { baseElement } = render(<Button cssClass="primary" title="button title" />);

    expect(baseElement).toBeTruthy();
    const button = baseElement.getElementsByTagName('button')[0];
    const spans = button.getElementsByTagName('span');

    expect(spans.length).toBeTruthy();
    expect(spans[0].innerHTML).toBe('button title');
  });

  it('Should check icon', () => {
    const { baseElement } = render(<Button cssClass="primary" icon={<div>icon</div>} title="button title" />);

    expect(baseElement).toBeTruthy();
    const button = baseElement.getElementsByTagName('button')[0];
    const divs = button.getElementsByTagName('div');

    expect(divs.length).toBeTruthy();
    expect(divs[0].innerHTML).toBe('icon');

    const spans = button.getElementsByTagName('span');

    expect(spans.length).toBeTruthy();
    expect(spans[0].classList.contains('ml-2')).toBeTruthy();
  });

  it('Should check click', () => {
    let buttonClick = false;
    const onClick = () => {
      buttonClick = true;
    };
    const { baseElement } = render(<Button cssClass="primary" onClick={onClick} />);

    expect(baseElement).toBeTruthy();
    const button = baseElement.getElementsByTagName('button')[0];
    fireEvent.click(button);
    expect(buttonClick).toBeTruthy();
  });
});
