import { render } from '@testing-library/react';
import Field from './Field';

describe('Common components - Field', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<Field htmlFor="test id" />);

    expect(baseElement).toBeTruthy();
    const label = baseElement.getElementsByTagName('label')[0];
    expect(label.htmlFor).toBe('test id');
  });

  it('Should set fieldTitle', () => {
    const { baseElement } = render(<Field htmlFor="test id" fieldTitle="Title" />);

    expect(baseElement).toBeTruthy();
    const label = baseElement.getElementsByTagName('label')[0];
    expect(label.innerHTML).toBe('<div class="flex justify-between min-h-4">Title</div>');
  });

  it('Should set optional', () => {
    const { baseElement } = render(<Field htmlFor="test id" fieldTitle="Title" optional={true} />);

    expect(baseElement).toBeTruthy();
    const label = baseElement.getElementsByTagName('label')[0];
    const span = label.getElementsByTagName('span')[0];
    expect(span.innerHTML).toBe('(Optional)');
  });

  it('Should set icon after title', () => {
    const { baseElement } = render(<Field htmlFor="test id" fieldTitle="Title" iconAfterTitle={<svg />} />);

    expect(baseElement).toBeTruthy();
    const label = baseElement.getElementsByTagName('label')[0];
    expect(label).toBeTruthy();
    const div = label.getElementsByTagName('div')[0];
    expect(div).toBeTruthy();
    const svg = div.getElementsByTagName('svg')[0];
    expect(svg).toBeTruthy();
  });
});
