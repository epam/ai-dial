import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Common components - Loader', () => {
  global.console = {
    ...console,
    error: jest.fn(),
  };
  it('Should render successfully', () => {
    const { baseElement } = render(<Loader />);
    expect(baseElement).toBeTruthy();
  });
});
