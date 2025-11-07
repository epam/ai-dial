import { fireEvent, render } from '@testing-library/react';
import Input from './Input';

describe('Common components - Input', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<Input inputId="testInput" />);
    expect(baseElement).toBeTruthy();
  });

  it('Should set string value in text input', () => {
    const res = render(<Input inputId="testInput" type="text" value="str" />);
    const input = res.getByDisplayValue('str');
    expect(input).toBeTruthy();
    expect(input.id).toBe('testInput');
  });

  it('Should set number value in text input', () => {
    const res = render(<Input inputId="testInput" type="text" value="str" />);
    const input = res.getByDisplayValue('str');
    expect(input).toBeTruthy();
    expect(input.id).toBe('testInput');
  });

  it('Should set number value in number input', () => {
    const res = render(<Input inputId="testInput" type="number" value={1} />);
    const input = res.getByDisplayValue(1);
    expect(input).toBeTruthy();
    expect(input.id).toBe('testInput');
  });

  it('Should set string value in number input', () => {
    const res = render(<Input inputId="testInput" type="number" value="str" />);
    const input = res.baseElement.getElementsByTagName('input')[0];
    expect(input).toBeTruthy();
    expect(input.value).toBe('');
    expect(input.value).not.toBe('str');
  });

  it('Should check OnChange', () => {
    let value = 1;
    const onChange = (v: string) => {
      value = Number(v);
    };

    const { baseElement } = render(<Input inputId="testInput" type="number" value={value} onChange={onChange} />);
    const input = baseElement.getElementsByTagName('input')[0];

    expect(input).toBeTruthy();
    expect(Number(input.value)).toBe(1);
    fireEvent.change(input, { target: { value: 2 } });
    expect(value).toBe(2);
  });
});
