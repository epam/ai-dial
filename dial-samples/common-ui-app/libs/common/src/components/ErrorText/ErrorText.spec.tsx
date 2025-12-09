import { render } from '@testing-library/react';
import ErrorText from './ErrorText';

describe('Common components - ErrorText', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<ErrorText />);

    const span = baseElement.getElementsByTagName('span');
    expect(baseElement).toBeTruthy();
    expect(span.length).toBe(0);
  });

  it('Should set error text', () => {
    const { baseElement } = render(<ErrorText errorText="error text" />);

    const span = baseElement.getElementsByTagName('span');
    expect(baseElement).toBeTruthy();
    expect(span.length).toBe(1);
    expect(span[0].innerHTML).toBe('error text');
  });
});
