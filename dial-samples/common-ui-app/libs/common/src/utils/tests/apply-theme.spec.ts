import { applyTheme } from '../apply-theme';

describe('Utils :: applyTheme', () => {
  it('Should do not find theme', () => {
    const div = document.createElement('div');
    applyTheme([{ id: 'theme', displayName: 'theme', colors: { red: 'red' } }], 'theme1');
    expect(div.style.getPropertyValue('--red')).toBe('');
  });

  it('Should set colors', () => {
    const div = document.createElement('div');
    applyTheme([{ id: 'theme', displayName: 'theme', colors: { red: 'red' } }], 'theme', div);
    expect(div.style.getPropertyValue('--red')).toBe('red');
  });
});
