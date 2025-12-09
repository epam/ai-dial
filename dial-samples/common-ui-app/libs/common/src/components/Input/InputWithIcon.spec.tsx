import { render } from '@testing-library/react';
import InputWithIcon from './InputWithIcon';

describe('Common components - InputWithIcon', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(
      <InputWithIcon inputId="testInput" iconBeforeInput={<div>Before</div>} iconAfterInput={<div>After</div>} />,
    );
    expect(baseElement).toBeTruthy();
  });

  it('Should check invalid true', () => {
    const { baseElement } = render(<InputWithIcon inputId="testInput" type="text" value="str" invalid={true} />);

    expect(baseElement).toBeTruthy();
    const div = baseElement.getElementsByTagName('div')[1];

    expect(div).toBeTruthy();
    expect(div.className.includes('input-error')).toBeTruthy();
  });
});
